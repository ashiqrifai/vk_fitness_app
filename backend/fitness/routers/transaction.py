from fastapi import APIRouter, HTTPException, Request, Security
from fastapi.encoders import jsonable_encoder
from fastapi.params import Depends, Query
from sqlalchemy.orm import Session
from datetime import date
from sqlalchemy.ext.declarative import declarative_base
from .. import models, schemas
from ..database import get_db
from passlib.context import CryptContext
from datetime import datetime
from typing import List, Dict
from fastapi import FastAPI, status, Response, HTTPException
from sqlalchemy import func, text, and_
import requests
from fastapi import FastAPI
import httpx
from fastapi.security import HTTPBasic, HTTPBasicCredentials
import base64
from fastapi.responses import JSONResponse
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine


router = APIRouter()
security = HTTPBasic()

def encode_to_base64(auth_key: str, auth_token: str) -> str:
    """Combine auth_key and auth_token and encode them in base64."""
    combined_string = f"{auth_key}:{auth_token}"
    encoded_bytes = base64.b64encode(combined_string.encode())
    encoded_string = encoded_bytes.decode('utf-8')
    return encoded_string

@router.get("/encode")
def get_encoded_string(auth_key: str, auth_token: str):
    """Endpoint to get encoded string from auth_key and auth_token."""
    encoded_string = encode_to_base64(auth_key, auth_token)
    return {"encoded": encoded_string}


@router.post("/extend_session")
def session_extend(request: schemas.ExtendSession, db: Session = Depends(get_db)):
    try:
        ptquery = db.query(models.MemberPTSessions).filter(models.MemberPTSessions.transaction_id == request.transid).first()
        ptquery.end_date = request.extendeddate
        db.commit()
        db.refresh(ptquery)
        return ptquery;

    except Exception as e:
          raise HTTPException(status_code=500, detail=str(e))

@router.get("/expired_sessions")
def get_expired_pt_sessions(db: Session = Depends(get_db)):
    try:
        results = db.query(models.MemberPTSessions, models.Members).\
            join(models.Members, models.Members.id == models.MemberPTSessions.member_id).\
            filter(models.MemberPTSessions.end_date < '2024-02-03').all()

        sessions = []
        for session, member in results:
            session_data = {**session.__dict__, **member.__dict__}
            del session_data["_sa_instance_state"]  # Remove SQLAlchemy specific attribute
            sessions.append(session_data)

        return sessions
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/salesdata")
def get_sales_data(
    startdate: date = Query(..., description="Start date for filtering"),
    enddate: date = Query(..., description="End date for filtering"),
    club_id: int = Query(..., description="Club ID to filter results"),
    db: Session = Depends(get_db)
):
    # Define your SQL query with an additional WHERE clause for club_id
    sql_query = text(
        "SELECT transactions.id, transactions.trandate, transactions.invoiceno, transactions.club_id, transactions.clubname,"
        " transactions.membership_id, transactions.description, transactions.membername, COALESCE(transactions.transaction_amount, 0) AS transaction_amount,"
        " transactions.mobilenumber, transactions.email, COALESCE(products.products_amt, 0) AS products_amt, COALESCE(discount.discamt, 0) AS discount_amt"
        " FROM"
        " (SELECT a.id, a.trandate, a.invoiceno, a.club_id, b.clubname, a.membership_id, e.description, CONCAT(d.firstname, ' ', d.lastname) AS membername,"
        " a.transaction_amount, d.mobilenumber, d.email"
        " FROM transactionheader a"
        " INNER JOIN clubs b ON a.club_id = b.id"
        " INNER JOIN transactionmembers c ON a.id = c.transaction_id"
        " INNER JOIN members d ON c.member_id = d.id"
        " INNER JOIN memberships e ON a.membership_id = e.id"
        " WHERE a.trandate BETWEEN :startdate AND :enddate AND a.club_id = :club_id) transactions"
        " LEFT OUTER JOIN"
        " (SELECT transaction_id, SUM(amount) AS products_amt"
        " FROM transactionproducts"
        " GROUP BY transaction_id) products ON transactions.id = products.transaction_id"
        " LEFT OUTER JOIN"
        " (SELECT transaction_id, SUM(amount) AS discamt"
        " FROM transactiondiscounts"
        " GROUP BY transaction_id) discount ON transactions.id = discount.transaction_id"
    )

    # Execute the SQL query and fetch the result
    result = db.execute(sql_query, {"startdate": startdate, "enddate": enddate, "club_id": club_id})

    columns = [desc[0] for desc in result.cursor.description]

    # Convert rows to a list of dictionaries
    result_list = [dict(zip(columns, row)) for row in result.fetchall()]

    return result_list


@router.get("/membertransactions")
async def get_commissions(
    member_id: int = Query(..., description="Member ID for filtering"),
    club_id: int = Query(..., description="Club ID for filtering"),

    db: Session = Depends(get_db)
) -> List[Dict]:
    sql_query = text("""
        SELECT transactions.id, transactions.trandate, transactions.invoiceno,
               transactions.member_name, transactions.description, transactions.startdate,
               transactions.enddate, transactions.transaction_amount,
               COALESCE(products.product_amount, 0) AS product_amount,
               COALESCE(transaction_discount.discount, 0) AS discount
        FROM (
            SELECT a.id, a.trandate, a.invoiceno, CONCAT(c.firstname, ' ', c.lastname) AS member_name,
                   d.description, a.startdate, a.enddate, a.transaction_amount
            FROM transactionheader a
            JOIN transactionmembers b ON a.id = b.transaction_id
            JOIN members c ON b.member_id = c.id
            JOIN memberships d ON a.membership_id = d.id
            WHERE c.id = :member_id
            AND a.club_id = :club_id
        ) AS transactions
        LEFT OUTER JOIN (
            SELECT transaction_id, SUM(amount) AS discount
            FROM transactiondiscounts
            GROUP BY transaction_id
        ) AS transaction_discount ON transactions.id = transaction_discount.transaction_id
        LEFT OUTER JOIN (
            SELECT transaction_id, SUM(amount) AS product_amount
            FROM transactionproducts
            GROUP BY transaction_id
        ) AS products ON transactions.id = products.transaction_id
    """)

    result = db.execute(sql_query, {"member_id": member_id, "club_id": club_id})

    # Extract column names from the cursor description
    columns = [desc[0] for desc in result.cursor.description]

    # Convert rows to a list of dictionaries
    result_list = [dict(zip(columns, row)) for row in result.fetchall()]

    return result_list

@router.get("/commissions", tags=["Commissions"])
def get_pt_commission(
    startdate: date = Query(..., description="Start date for filtering"),
    enddate: date = Query(..., description="End date for filtering"),
    club_id: int = Query(..., description="Club ID for filtering"),
    db: Session = Depends(get_db)
) -> List[Dict]:
    sql_query = text("""
    SELECT 
        a.tranid,
        a.trandate,
        a.ptname,
        a.club_id,
        a.clubname,
        a.membership_amt,
        a.act_rate,
        a.member_name,
        a.transaction_id,
        a.amount,
        a.total_sessions,
        conductedsessions.conducted_sessions,
        ptcomm.percentage,
        a.act_rate / NULLIF(a.total_sessions, 0) * ptcomm.percentage / 100 AS commission_per_session,
        a.act_rate / NULLIF(a.total_sessions, 0) * ptcomm.percentage / 100 * conductedsessions.conducted_sessions AS total_commission,
        u.id AS user_id,
        user_sessions.total_sessions_by_user,
        totalsessions.total_completed, 
        a.total_sessions - totalsessions.total_completed remaining_sessions  
    FROM 
        commission_view a
    JOIN (
        SELECT 
            a.id, 
            a.assigned_to_user AS user_id,
            COUNT(b.session_status) AS conducted_sessions
        FROM 
            PtSessionHeader a
        JOIN 
            PtSessionDetail b ON a.id = b.pt_session_id
        WHERE 
            b.session_date BETWEEN :startdate AND :enddate
        GROUP BY 
            a.id, a.assigned_to_user
    ) AS conductedsessions ON a.tranid = conductedsessions.id
    JOIN (
        SELECT 
            assigned_to_user AS user_id,
            COUNT(b.session_status) AS total_sessions_by_user
        FROM 
            PtSessionHeader a
        JOIN 
            PtSessionDetail b ON a.id = b.pt_session_id
        WHERE 
            b.session_date BETWEEN :startdate AND :enddate
        GROUP BY 
            assigned_to_user
    ) AS user_sessions ON conductedsessions.user_id = user_sessions.user_id
    JOIN ptcommission ptcomm ON user_sessions.total_sessions_by_user BETWEEN ptcomm.slab_from AND ptcomm.slab_to
    JOIN users u ON u.id = conductedsessions.user_id
    JOIN (
        SELECT 
            a.id AS tranid,
            COUNT(b.session_status) AS total_completed
        FROM 
            PtSessionHeader a
        JOIN 
            PtSessionDetail b ON a.id = b.pt_session_id
        GROUP BY 
            a.id
    ) AS totalsessions ON a.tranid = totalsessions.tranid
    WHERE 
        a.club_id = :club_id
    """)

    # Execute the query with parameters
    result = db.execute(sql_query, {"startdate": startdate, "enddate": enddate, "club_id": club_id})

    # Extract column names from the cursor description
    columns = [desc[0] for desc in result.cursor.description]

    # Convert rows to a list of dictionaries
    result_list = [dict(zip(columns, row)) for row in result.fetchall()]

    return result_list

@router.get("/commissiondetail")
def get_pt_commission(
    transaction_id: int = Query(..., description="Enter Tran Id for filtering"),  # Added club_id parameter
    db: Session = Depends(get_db)
) -> List[Dict]:
    sql_query = text("""
    SELECT 
        a.id,
        a.assigned_date,
        a.start_date,
        a.end_date,
        b.id as session_id,
        b.session_date,
        CASE 
            WHEN b.session_status = 1 THEN 'Conducted' 
            ELSE 'No Show' 
        END as session_status 
    FROM 
        PtSessionHeader a
    JOIN 
        PtSessionDetail b ON a.id = b.pt_session_id
    WHERE 
        a.id = :transaction_id
    ORDER BY 
        b.session_date
    """)

    # Execute the query with parameters
    result = db.execute(sql_query, {"transaction_id": transaction_id})

    # Extract column names from the cursor description
    columns = [desc[0] for desc in result.cursor.description]

    # Convert rows to a list of dictionaries
    result_list = [dict(zip(columns, row)) for row in result.fetchall()]

    return result_list

@router.get("/pt_commission")
def get_pt_commission(
    startdate: date = Query(..., description="Start date for filtering"),
    enddate: date = Query(..., description="End date for filtering"),
    clubid: int = Query(..., description="club id"),

    db: Session = Depends(get_db)):
    # Define your SQL query as a multi-line string
    sql_query = text("SELECT * FROM pt_commission_view where assigned_date BETWEEN :startdate AND :enddate and club_id = :clubid")

    # Execute the SQL query and fetch the result
    result = db.execute(sql_query, {"startdate": startdate, "enddate": enddate, "clubid": clubid})

    

    # Get the column names from the cursor description
    columns = [desc[0] for desc in result.cursor.description]

    # Convert rows to a list of dictionaries
    result_list = [dict(zip(columns, row)) for row in result]

    return result_list



@router.put('/ptassign/{ptassign_id}')
def update_pt_assign(ptassign_id: int, request: schemas.PTSessionAssign, db: Session = Depends(get_db)):
    try:
        existing_pt_assign = db.query(models.MemberPTSessions).filter(models.MemberPTSessions.id == ptassign_id).first()

        if not existing_pt_assign:
            raise HTTPException(status_code=404, detail=f'PT Session with ID {ptassign_id} not found')

        existing_pt_assign.assigned_date = request.assignedDate
        existing_pt_assign.start_date = request.startDate
        existing_pt_assign.end_date = request.endDate
        existing_pt_assign.transaction_id = request.transactionId
        existing_pt_assign.member_id = request.memberId
        existing_pt_assign.assigned_to_user = request.assignedUser
        existing_pt_assign.club_id = request.clubId
        existing_pt_assign.pt_sessions = request.ptsessions
        existing_pt_assign.amount = request.amount

        db.commit()
        db.refresh(existing_pt_assign)
        return existing_pt_assign

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@router.post('/ptreassign')
def MemberPTReAssign(request: schemas.MemberSessionAssign, db: Session = Depends(get_db)):
    try:

        ptquery = db.query(models.MemberPTSessions).filter(models.MemberPTSessions.id == request.session_id).first()
       
        existing_assignment = db.query(models.MemberPTSessions).filter(
            models.MemberPTSessions.transaction_id == ptquery.transaction_id,            
            models.MemberPTSessions.assigned_to_user == request.assigned_to
        ).first()

        if existing_assignment:
            raise HTTPException(status_code=400, detail="Session already assigned to this user.")
        
        upd_sessions = ptquery.pt_sessions - request.sessions
        ptquery.pt_sessions = upd_sessions

       
        new_pt_assign = models.MemberPTSessions(assigned_date = ptquery.assigned_date, start_date = ptquery.start_date, end_date = ptquery.end_date, 
                                                transaction_id = ptquery.transaction_id, member_id = ptquery.member_id, assigned_to_user = request.assigned_to, 
                                                club_id = ptquery.club_id, pt_sessions = request.sessions, amount = ptquery.amount)
        db.add(new_pt_assign)
        db.commit();
        db.refresh(new_pt_assign)
        return new_pt_assign

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code = 500, detail= str(e))
        

@router.post('/ptassign')
def updateptassign(request: schemas.PTSessionAssign, db: Session = Depends(get_db)):
    try:
        new_pt_assign = models.MemberPTSessions(assigned_date = request.assignedDate, start_date = request.startDate, end_date = request.endDate, 
                                                transaction_id = request.transactionId, member_id = request.memberId, assigned_to_user = request.assignedUser, 
                                                club_id = request.clubId, pt_sessions = request.ptsessions, amount = request.amount)
        db.add(new_pt_assign)
        db.commit();
        db.refresh(new_pt_assign)
        return new_pt_assign
      
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    

@router.get('/member_pt_details/{member_id}')
def get_member_pt_details(member_id: int, db: Session = Depends(get_db)):
    member = db.query(models.Members).filter(models.Members.id == member_id).first()

    if not member:
        raise HTTPException(status_code=404, detail="Member not found")

    member_name = f"{member.firstname} {member.lastname}"

    member_pt_sessions = (
        db.query(models.MemberPTSessions)
        .filter(models.MemberPTSessions.member_id == member_id)
        .all()
    )

    result = {
        "MemberName": member_name,
        "MemberPTSessions": [
            {
                "AssignedDate": pt_session.assigned_date,
                "StartDate": pt_session.start_date,
                "EndDate": pt_session.end_date,
                "AssignedToUser": pt_session.user.email_address,  # Include assigned_to_user information
                "PTSessions": pt_session.pt_sessions,
                "Amount": pt_session.amount,
                "PTSessionDetails": [
                    {
                        "SessionDate": pt_detail.session_date,
                        "SessionStatus": pt_detail.session_status,
                    }
                    for pt_detail in pt_session.pt_session_details
                ],
            }
            for pt_session in member_pt_sessions
        ],
    }

    return result

@router.post('/ptsessiondetail')
def post_session_detal(request: schemas.ptsessiondetail, db: Session = Depends(get_db)):

    try: 
        new_pt_detail = models.MemberPTDetail(session_date = request.session_date, pt_session_id = request.pt_session_id, session_status = request.pt_session_status)
        db.add(new_pt_detail)
        db.commit()
        db.refresh(new_pt_detail)
        return new_pt_detail    
      
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.post('/transaction')
def createTransaction(request: schemas.Transaction, db: Session = Depends(get_db)):
    try:

        membershipquery = db.query(models.Memberships).filter(models.Memberships.id == request.membership_id).first()

        new_transaction = models.TransactionHeader(
            trandate = request.trandate,
            invoiceno=request.invoiceno,
            remarks=request.remarks,
            club_id=request.club_id,
            user_id=request.user_id,
            startdate = request.startDate,
            enddate = request.endDate,
            transaction_amount = request.amount,
            membership_id=request.membership_id
        )

        db.add(new_transaction)
        db.flush()

        if membershipquery.membershiptype == "PT":
            pt_member = models.MemberPTSessions(

                    assigned_date = request.startDate, 
                    start_date = request.startDate, 
                    end_date = request.endDate, 
                    transaction_id = new_transaction.id, 
                    member_id = request.memberlist[0].memberId, 
                    assigned_to_user = request.assignedUser, 
                    club_id = request.club_id, 
                    pt_sessions = request.noSessions, 
                    amount = request.amount

                    
            )
            
            db.add(pt_member)
            db.flush()

         
        
      

        transaction_members = []
        for member_data in request.memberlist:
            member_id = member_data.memberId  # Access memberId directly
            transaction_member = models.TransactionMembers(
                member_id=member_id,
                transaction_id=new_transaction.id
            )
            db.add(transaction_member)
            db.flush()  # Flush each transaction_member to ensure they are committed individually
            transaction_members.append(transaction_member)
        
        transaction_discounts = []
        if request.discountlist:
            for discount_data in request.discountlist:
                discount_id = discount_data.discountId
                discount_amount = discount_data.amount
                transaction_discount = models.TransactionDiscounts(
                    discount_id = discount_id,
                    amount = discount_amount,
                    transaction_id = new_transaction.id
                )

                db.add(transaction_discount)
                db.flush()
                transaction_discounts.append(transaction_discount)

        
        transaction_products = []
        if request.productlist:
            for products_data in request.productlist:
                product_id = products_data.productId
                product_amount = products_data.amount
                transaction_product = models.TransactionProducts(
                    product_id = product_id,
                    amount = product_amount,
                    transaction_id = new_transaction.id
                )

                db.add(transaction_product)
                db.flush()
                transaction_products.append(transaction_product)


        transaction_payments = []
        for payment_data in request.payments:
            payment_id = payment_data.paymentId  # Access memberId directly
            payment_amount = payment_data.paymentamount
            transaction_payment = models.TransactionPayments(
                payment_id=payment_id,
                transaction_id=new_transaction.id,
                payment_amount = payment_amount
            )
            db.add(transaction_payment)
            db.flush()  # Flush each transaction_member to ensure they are committed individually
            transaction_payments.append(transaction_payment)

        db.commit()
        db.refresh(new_transaction)

        for member in transaction_members:
            db.refresh(member)

        for payment in transaction_payments:
            db.refresh(payment)
        
        for product in transaction_products:
            db.refresh(product)
        
        for discount in transaction_discounts:
            db.refresh(discount)


        response_data = {
            "new_transaction": new_transaction,
            "transaction_members": transaction_members,
            "transaction_payments": transaction_payments,
            "transaction_products": transaction_products,
            "transaction_discounts": transaction_discounts
        }

        return response_data
    
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.get('/transactionmember')
async def get_transactions(member_id: int, db: Session = Depends(get_db)):
    transactions = (
        db.query(models.TransactionHeader, models.Memberships, models.Clubs)
        .join(models.TransactionMembers)
        .join(models.Memberships, models.TransactionHeader.membership_id == models.Memberships.id)
        .join(models.Clubs, models.TransactionHeader.club_id == models.Clubs.id)
        .outerjoin(models.MemberPTSessions, models.TransactionHeader.id == models.MemberPTSessions.transaction_id)
        .filter(models.TransactionMembers.member_id == member_id, models.Memberships.membershiptype == 'PT')
        .all()
    )

    response_data = []
    for transaction, membership, club in transactions:
        member = transaction.transactions[0].member
        member_name = f"{member.firstname} {member.lastname}"
        
        response_data.append(
            schemas.TransactionResponse(
                transaction_id=transaction.id,
                trandate=transaction.trandate,
                invoiceno=transaction.invoiceno,
                membership_id=transaction.membership_id,
                membership_description=membership.description,  # Add membership data to response
                remarks=transaction.remarks,
                member_id=member.id,
                member_name=member_name,
                transaction_amount = transaction.transaction_amount,
                club_id = member.club_id,
                club_name = club.clubname
            )
        )

    return response_data
#latest updated 16/07/2024
from sqlalchemy.orm import Session
from sqlalchemy.sql import func
from fastapi import APIRouter, Depends
from .. import models
from ..database import get_db

router = APIRouter()

@router.get('/memberptsessions')
def get_member_pt_sessions(
    assigned_to_user: int,
    db: Session = Depends(get_db)
):
    # Join MemberPTSessions, Users, and Members tables based on assigned_to_user
    query = (
        db.query(
            models.MemberPTSessions.id,
            models.MemberPTSessions.assigned_date,
            models.MemberPTSessions.start_date,
            models.MemberPTSessions.end_date,
            models.MemberPTSessions.pt_sessions,
            models.Members.firstname,
            models.Members.lastname,
            func.count(models.MemberPTDetail.id).label("session_detail_count")
        )
        .join(models.Members, models.Members.id == models.MemberPTSessions.member_id)
        .outerjoin(models.MemberPTDetail, models.MemberPTDetail.pt_session_id == models.MemberPTSessions.id)  # Ensure correct join condition
        .filter(models.MemberPTSessions.assigned_to_user == assigned_to_user)
        .group_by(
            models.MemberPTSessions.id,
            models.MemberPTSessions.assigned_date,
            models.MemberPTSessions.start_date,
            models.MemberPTSessions.end_date,
            models.MemberPTSessions.pt_sessions,
            models.Members.firstname,
            models.Members.lastname
        )  # Group by session-related columns
        .all()
    )

    # Serialize the query results into the desired response format
    member_pt_sessions = [
        {
            "session_id": session.id,
            "membername": f"{session.firstname} {session.lastname}",
            "total_sessions": session.pt_sessions,
            "session_detail_count": session.session_detail_count,
            "remaining_sessions": session.pt_sessions - session.session_detail_count,
            "assigned_date": session.assigned_date,
            "start_date": session.start_date,
            "end_date": session.end_date,
        }
        for session in query
    ]

    return member_pt_sessions



@router.get('/transactionbyid')
async def get_transactions(transaction_id: int, db: Session = Depends(get_db)):
    transactions = (
        db.query(models.TransactionHeader, models.Memberships, models.Clubs)
        .join(models.TransactionMembers)
        .join(models.Memberships, models.TransactionHeader.membership_id == models.Memberships.id)
        .join(models.Clubs, models.TransactionHeader.club_id == models.Clubs.id)
        .filter(models.TransactionHeader.id == transaction_id, models.Memberships.membershiptype == 'PT')
        .all()
    )

    response_data = []
    for transaction, membership, club in transactions:
        member = transaction.transactions[0].member
        member_name = f"{member.firstname} {member.lastname}"
        
        response_data.append(
            schemas.TransactionResponse(
                transaction_id=transaction.id,
                trandate=transaction.trandate,
                invoiceno=transaction.invoiceno,
                transaction_amount = transaction.transaction_amount,
                membership_id=transaction.membership_id,
                membership_description=membership.description,  # Add membership data to response
                remarks=transaction.remarks,
                member_id=member.id,
                member_name=member_name,
                club_id = member.club_id,
                club_name = club.clubname
            )
        )

    return response_data


@router.get("/pt_sessions_and_details/{member_id}/{transaction_id}")
def get_pt_sessions_and_details(member_id: int, transaction_id: int, db: Session = Depends(get_db)):
    # Query the MemberPTSessions and MemberPTDetail tables and join them
    sessions_and_details = (
        db.query(models.MemberPTSessions, models.MemberPTDetail)
        .filter(models.MemberPTSessions.member_id == member_id, models.MemberPTSessions.transaction_id == transaction_id)
        .outerjoin(models.MemberPTDetail)  # Perform a left outer join
        .all()
    )

    response_data = {}
    for session, detail in sessions_and_details:
        session_id = session.id

        if session_id not in response_data:
            response_data[session_id] = {
                "session_id": session_id,
                "assigned_date": session.assigned_date,
                "start_date": session.start_date,
                "end_date": session.end_date,
                "pt_sessions": session.pt_sessions,
                "session_details": []
            }

        if detail is not None:
            response_data[session_id]["session_details"].append({
                "detail_id": detail.id,
                "session_date": detail.session_date,
            })

    return list(response_data.values())

@router.get('/TransactionPTSessions')
def get_transactions_with_pt_sessions_and_memberships(member_id: int, db: Session = Depends(get_db)):
    # Use a left outer join to fetch TransactionHeader data with MemberPTSessions and Memberships
    transactions = (
        db.query(models.TransactionHeader, models.Memberships, models.Clubs, models.Users)
        .join(models.TransactionMembers)
        .join(models.Memberships, models.TransactionHeader.membership_id == models.Memberships.id)
        .join(models.Clubs, models.TransactionHeader.club_id == models.Clubs.id)
        .outerjoin(models.MemberPTSessions)      
        .outerjoin(models.Users, models.MemberPTSessions.assigned_to_user == models.Users.id)        
        .filter(
            models.TransactionMembers.member_id == member_id,  # Filter by member_id
            models.Memberships.membershiptype == 'PT',
        )
        .all()
    )

    transaction_list = []

    for transaction, membership, club, user in transactions:
        member = transaction.transactions[0].member
        member_name = f"{member.firstname} {member.lastname}"
        transaction_dict = {
            "transaction_id": transaction.id,
            "trandate": transaction.trandate,
            "invoiceno": transaction.invoiceno,
            "remarks": transaction.remarks,
            "member_id": member.id,
            "member_name": member_name,
            "membership_id":transaction.membership_id,
            "membership_description": membership.description,
            "transaction_amount": transaction.transaction_amount,
            "club_id": transaction.club_id,  
            "club_name": club.clubname,
            "assigned_to_user_id": user.id if user else None,
            "assigned_to_user_name": f"{user.first_name} {user.last_name}" if user else None,


        }

        if transaction.member_pt_sessions:
            # Add MemberPTSessions data if available
            transaction_dict["member_pt_sessions"] = [
                {
                    "id": pt_session.id,
                    "assigned_date": pt_session.assigned_date,
                    "start_date": pt_session.start_date,
                    "end_date": pt_session.end_date,
                    "assigned_to": pt_session.assigned_to_user,
                    # Add other MemberPTSessions columns as needed
                }
                for pt_session in transaction.member_pt_sessions
            ]

        transaction_list.append(transaction_dict)

    return transaction_list



@router.post("/send_sms/")
async def send_sms(mobileno: str, orderno: str, timeslot: str, slotdate: str):
    return await ordersms(mobileno, orderno, timeslot, slotdate)


async def ordersms(mobileno: str, orderno: str, timeslot: str, slotdate: str):
    user = "snapfitnessuae"  # your username
    password = "Snapfitness247!"  # your password
    mobilenumbers = mobileno  # enter Mobile numbers comma separated
    message = f"Thank you for registering your Fitness Assesment Session on {slotdate} by Snap Fitness, your time slot is {timeslot} hrs. your Confirmation Reference Is {orderno}. Thank You!"  # enter Your Message
    senderid = "SnapFitness"  # Your senderid
    messagetype = "N"  # Type Of Your Message
    DReports = "Y"  # Delivery Reports
    url = "http://www.smscountry.com/SMSCwebservice_Bulk.aspx"

    async with httpx.AsyncClient() as client:
        params = {
            "User": user,
            "passwd": password,
            "mobilenumber": mobilenumbers,
            "message": message,
            "sid": senderid,
            "mtype": messagetype,
            "DR": DReports
        }
        response = await client.post(url, data=params)
        return response.text
