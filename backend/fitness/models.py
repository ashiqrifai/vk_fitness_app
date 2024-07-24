from sqlalchemy import Column, Date, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from .database import Base
from datetime import date, datetime
from sqlalchemy.ext.associationproxy import association_proxy

class Clubs(Base):
    __tablename__ = "clubs"
    id = Column(Integer, primary_key=True, index=True)
    clubname = Column(String)
    clubcity = Column(String)

    members = relationship("Members", back_populates="club")
    transactions = relationship("TransactionHeader", back_populates="club")
    pt_sessions = relationship("MemberPTSessions", back_populates="club")

    user_clubs = relationship("UserClubs", back_populates="club")
    users = association_proxy('user_clubs', 'user')

class Memberships(Base):
    __tablename__ = "memberships"
    id = Column(Integer, primary_key=True, index=True)
    description = Column(String)
    membershiptype = Column(String)
    amount = Column(Float)
    validity = Column(Integer)
    sessions = Column(Integer)
    nsid = Column(String)
    createddate = Column(DateTime)

    # Define the relationship to TransactionHeader
    transactions = relationship("TransactionHeader", back_populates="membership")

class NSMembers(Base):
    __tablename__ = "nsmembers"
    id = Column(Integer, primary_key = True, index = True)
    nsid = Column(Integer)

    member_id = Column(Integer, ForeignKey("members.id"))
    member = relationship("Members", back_populates="ns_members")


class Members(Base):
    __tablename__ = "members"
    id = Column(Integer, primary_key=True, index=True)
    firstname = Column(String)
    lastname = Column(String)
    mobilenumber = Column(String)
    barcode = Column(String)
    email = Column(String)
    createdate = Column(DateTime)

    club_id = Column(Integer, ForeignKey("clubs.id"))
    club = relationship("Clubs", back_populates="members")

    transactions = relationship("TransactionMembers", back_populates="member")

    pt_sessions = relationship("MemberPTSessions", back_populates="member")

    ns_members = relationship("NSMembers", back_populates="member")


class TransactionHeader(Base):
    __tablename__ = "transactionheader"
    id = Column(Integer, primary_key=True, index=True)
    trandate = Column(DateTime)
    invoiceno = Column(String)
    remarks = Column(String)

    club_id = Column(Integer, ForeignKey("clubs.id"))
    club = relationship("Clubs", back_populates="transactions")

    user_id = Column(Integer, ForeignKey("users.id"))
    user = relationship("Users", back_populates="transactions")

    startdate = Column(Date)
    enddate = Column(Date)

    membership_id = Column(Integer, ForeignKey("memberships.id"))
    membership = relationship("Memberships", back_populates="transactions")

    transactions = relationship("TransactionMembers", back_populates="transaction")
    transaction_payment = relationship("TransactionPayments", back_populates="transaction")  # Add this line     

    transaction_amount = Column(Float)

    member_pt_sessions = relationship("MemberPTSessions", back_populates="transaction")

    products = relationship("TransactionProducts", back_populates="transaction")  # Add this line
    discounts = relationship("TransactionDiscounts", back_populates="transaction")  # Add this line


class TransactionProducts(Base):
    __tablename__ = "transactionproducts"
    id = Column(Integer, primary_key = True, index=True)
    product_id = Column(Integer, ForeignKey("product.id"))  # Update this line
    amount = Column(Float)
    product = relationship("Products", back_populates="transactions")

    transaction_id = Column(Integer, ForeignKey("transactionheader.id"))  # Add this line
    transaction = relationship("TransactionHeader", back_populates="products")

class TransactionDiscounts(Base):
    __tablename__ = "transactiondiscounts"
    id = Column(Integer, primary_key = True, index = True)
    discount_id = Column(Integer, ForeignKey("discount.id"))
    amount = Column(Float)

    discount = relationship("Discounts", back_populates="transactions")

    transaction_id = Column(Integer, ForeignKey("transactionheader.id"))
    transaction = relationship("TransactionHeader", back_populates="discounts")


class TransactionMembers(Base):
    __tablename__ = "transactionmembers"
    id = Column(Integer, primary_key=True, index=True)
    
    member_id = Column(Integer, ForeignKey("members.id"))
    member = relationship("Members", back_populates="transactions")

    transaction_id = Column(Integer, ForeignKey("transactionheader.id"))
    transaction = relationship("TransactionHeader", back_populates="transactions")


class PTCommission(Base):
    __tablename__ = "ptcommission"
    id = Column(Integer, primary_key = True, index = True)
    slab_from = Column(Integer)
    slab_to = Column(Integer)
    percentage = Column(Integer)

class MemberPTDetail(Base):
    __tablename__ = "PtSessionDetail"
    id = Column(Integer, primary_key=True, index=True)

    session_date = Column(Date)
    session_status = Column(Integer)
    pt_session_id = Column(Integer, ForeignKey("PtSessionHeader.id"))
    pt_session = relationship("MemberPTSessions", back_populates="pt_session_details")


class MemberPTSessions(Base):
    __tablename__ = "PtSessionHeader"

    id = Column(Integer, primary_key=True, index=True)

    assigned_date = Column(Date)
    start_date = Column(Date)
    end_date = Column(Date)
    transaction_id = Column(Integer, ForeignKey("transactionheader.id"))
    transaction = relationship("TransactionHeader", back_populates="member_pt_sessions")

    member_id = Column(Integer, ForeignKey("members.id"))
    member = relationship("Members", back_populates="pt_sessions")

    assigned_to_user = Column(Integer, ForeignKey("users.id"))  # Add this line to establish the relationship with Users
    user = relationship("Users", back_populates="pt_sessions")

    club_id = Column(Integer, ForeignKey("clubs.id"))  # Add this line to link to the clubs table
    club = relationship("Clubs", back_populates="pt_sessions")

    pt_sessions = Column(Integer)
    amount = Column(Float)

    pt_session_details = relationship("MemberPTDetail", back_populates="pt_session")

class UserTypes(Base):
    __tablename__ = "usertype"
    id = Column(Integer, primary_key = True, index=True)
    usertype = Column(String)
    
class Products(Base):
    __tablename__ = "product"
    id = Column(Integer, primary_key=True, index=True)
    itemname = Column(String)
    amount = Column(Float)
    createdate = Column(DateTime)

    transactions = relationship("TransactionProducts", back_populates="product")  # Add this line

class Discounts(Base):
    __tablename__ = "discount"
    id = Column(Integer, primary_key=True, index=True)
    description = Column(String)
    createdate = Column(DateTime)

    transactions = relationship("TransactionDiscounts", back_populates="discount")


class Users(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True, index=True)
    email_address = Column(String)
    first_name = Column(String)
    last_name = Column(String)
    password = Column(String)
    usertype = Column(String)

    transactions = relationship("TransactionHeader", back_populates="user")
    pt_sessions = relationship("MemberPTSessions", back_populates="user")

    user_clubs = relationship("UserClubs", back_populates="user")
    clubs = association_proxy('user_clubs', 'club')

class UserClubs(Base):
    __tablename__ = 'userclubs'
    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey('users.id'))
    club_id = Column(Integer, ForeignKey('clubs.id'))    
    
    user = relationship("Users", back_populates="user_clubs")
    club = relationship("Clubs", back_populates="user_clubs")

    status = Column(Integer)

class PaymentMethods(Base):
    __tablename__ = "paymentmethods"
    id= Column(Integer, primary_key = True, index=True)
    payment_description = Column(String)

    transactions = relationship("TransactionPayments", back_populates="payments")

class TransactionPayments(Base):
    __tablename__ = "transactionpayment"
    id = Column(Integer, primary_key = True, index=True)

    transaction_id = Column(Integer, ForeignKey("transactionheader.id"))
    transaction = relationship("TransactionHeader", back_populates="transaction_payment")

    payment_id = Column(Integer, ForeignKey("paymentmethods.id"))
    payments = relationship("PaymentMethods", back_populates="transactions")

    payment_amount = Column(Float)

#latest update 16/07/2024
class PasswordResetToken(Base):
    __tablename__ = 'password_reset_tokens'
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    token = Column(String(36), unique=True, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    expires_at = Column(DateTime)

    user = relationship("Users")