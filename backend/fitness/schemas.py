from datetime import datetime, date
from pydantic import BaseModel
from typing import Optional, List


class ClubID(BaseModel):
    id: int

class UserType(BaseModel):
    usertype: str

class Products(BaseModel):
    itemname: str
    amount: float

class Discounts(BaseModel):
    description: str

class SessionSMS(BaseModel):
    session_id: int
    customermobile : str

class User(BaseModel):
    email_address: str
    first_name : str
    last_name: str
    password: str
    usertype: str
    clubs: List[ClubID]

    class Config:
        orm_mode = True

class UserListSchema(BaseModel):
    id: int
    first_name: str
    last_name : str

    class Config:
        orm_mode = True

class ExtendSession(BaseModel):
    transid: int
    extendeddate: date

class MemberShips(BaseModel):
    description: str
    membershiptype: str
    amount: float
    validity: int
    sessions: int
    nsid: str
  

class Clubs(BaseModel):
    clubname: str
    clubcity: str

class PaymentMethods(BaseModel):
    payment_description: str

class ptsessiondetail(BaseModel):
    session_date: date
    pt_session_id: int
    pt_session_status: int


class Member(BaseModel):
    firstname: str
    lastname: str
    mobilenumber: str
    barcode: str
    email: str
    club_id: int

class memberdata(BaseModel):
    memberId: int

class discountdata(BaseModel):
    discountId: int
    amount: float

class payments(BaseModel):
    paymentId: int
    paymentamount: float

class products(BaseModel):
    productId: int
    amount: float

class Transaction(BaseModel):
    trandate: datetime
    invoiceno: str
    remarks: str
    club_id: int
    user_id: int
    amount: float
    startDate: date
    endDate: date
    noSessions: int
    assignedUser: int
    membership_id : int
    memberlist: List[memberdata]
    payments: List[payments]
    productlist: List[products]
    discountlist : List[discountdata]


class TransactionResponse(BaseModel):
    transaction_id: int
    trandate: datetime
    invoiceno: str
    remarks: str
    member_id: int
    member_name: str
    membership_id: int
    membership_description: str
    transaction_amount : float
    club_id: int
    club_name: str

class MemberSessionAssign(BaseModel):
    session_id: int
    sessions: int
    assigned_to: int


class PTSessionAssign(BaseModel):
    sessionid: int
    assignedDate: date
    startDate: date
    endDate: date
    transactionId : int
    memberId: int
    assignedUser: int 
    clubId: int
    ptsessions: int
    amount: float

class login(BaseModel):
    email_address: str
    password: str


class MemberResponse(BaseModel):
    id: int
    firstname: str
    lastname: str
    mobilenumber: str
    barcode: str
    email: str
    createdate: datetime
    club_id: int

#latest update 16/07/2024
class PasswordUpdate(BaseModel):
    email_address: str
    current_password: str
    new_password: str
    
class ForgotPasswordRequest(BaseModel):
    email_address: str

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str