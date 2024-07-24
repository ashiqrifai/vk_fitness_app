from http.client import HTTPException
from fastapi import APIRouter
from datetime import datetime, timedelta
from fastapi.params import Depends
from sqlalchemy.orm import Session
from ..import models, schemas
from ..database import get_db
from passlib.context import CryptContext
from fastapi import FastAPI, status, Response, HTTPException
from typing import List
import uuid
from .email_utils import send_reset_email

router = APIRouter() 

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

@router.post('/createusertype')
def CreateUserType(request: schemas.UserType, db: Session = Depends(get_db)):
    new_user_type = models.UserTypes(usertype = request.usertype)
    db.add(new_user_type)
    db.commit()
    db.refresh(new_user_type)

    return new_user_type


@router.post('/createuser', response_model=schemas.User)  # Adjust the response_model as needed
def createUser(request: schemas.User, db: Session = Depends(get_db)):
    hashed_password = pwd_context.hash(request.password)
    new_user = models.Users(
        email_address=request.email_address, 
        first_name=request.first_name, 
        last_name=request.last_name, 
        password=hashed_password,  
        usertype=request.usertype
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    
    for club in request.clubs:
        new_user_club = models.UserClubs(user_id=new_user.id, club_id=club.id, status = 1)
        db.add(new_user_club)
    
    db.commit()

    # Optionally, modify the return value to include clubs or adjust as needed
    return new_user

@router.get('/listofusers', response_model=List[schemas.UserListSchema])  # Ensure you have a UserListSchema or similar
def list_users_by_club(club_id: int, db: Session = Depends(get_db)):
    # Query to join UserClubs and Users based on the provided club_id
    users = db.query(models.Users).\
             join(models.UserClubs, models.Users.id == models.UserClubs.user_id).\
             filter(models.UserClubs.club_id == club_id).all()

    if not users:
        raise HTTPException(status_code=404, detail="No users found for the given club ID")

    return users

@router.post('/login')
def userLogin(request: schemas.login, db: Session = Depends(get_db)):
    user = db.query(models.Users).filter(models.Users.email_address == request.email_address).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="INVALID USER NAME")
    if not pwd_context.verify(request.password, user.password):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="INVALID PASSWORD")

    # Assuming a many-to-many relationship with an association table, e.g., UserClubs
    clubs = (
        db.query(models.Clubs)
        .join(models.UserClubs, models.UserClubs.club_id == models.Clubs.id)
        .filter(models.UserClubs.user_id == user.id)
        .all()
    )

    # Preparing the response with user details and their associated clubs
    response_data = {
        "user_id": user.id,
        "email_address": user.email_address,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "user_type": user.usertype,
        "clubs": [{"club_id": club.id, "clubname": club.clubname, "clubcity": club.clubcity} for club in clubs]
    }

    return response_data


#latest update 16/07/2024
@router.put('/updatepassword')
def update_password(request: schemas.PasswordUpdate, db: Session = Depends(get_db)):
    user = db.query(models.Users).filter(models.Users.email_address == request.email_address).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    if not pwd_context.verify(request.current_password, user.password):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Current password is incorrect")

    hashed_new_password = pwd_context.hash(request.new_password)
    user.password = hashed_new_password

    db.commit()
    db.refresh(user)

    return {"detail": "Password updated successfully"}


@router.post('/forgotpassword')
def forgot_password(request: schemas.ForgotPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(models.Users).filter(models.Users.email_address == request.email_address).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    token = str(uuid.uuid4())
    expires_at = datetime.utcnow() + timedelta(hours=1)

    reset_token = models.PasswordResetToken(user_id=user.id, token=token, expires_at=expires_at)
    db.add(reset_token)
    db.commit()

    # Here you would normally send the token to the user's email
    # For this example, we will just return the token
    return {"token": token}

@router.post('/resetpassword')
def reset_password(request: schemas.ResetPasswordRequest, db: Session = Depends(get_db)):
    reset_token = db.query(models.PasswordResetToken).filter(models.PasswordResetToken.token == request.token).first()

    if not reset_token or reset_token.expires_at < datetime.utcnow():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired token")

    user = db.query(models.Users).filter(models.Users.id == reset_token.user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    hashed_new_password = pwd_context.hash(request.new_password)
    user.password = hashed_new_password

    db.delete(reset_token)
    db.commit()
    db.refresh(user)

    return {"detail": "Password reset successfully"}