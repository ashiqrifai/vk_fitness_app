from fastapi import APIRouter
from fastapi.params import Depends
from sqlalchemy.orm import Session
from ..import models, schemas
from ..database import get_db
from passlib.context import CryptContext

router = APIRouter() 

@router.post('/createclub')
def createClub(request: schemas.Clubs, db: Session = Depends(get_db)):
    new_club = models.Clubs(clubname = request.clubname, clubcity = request.clubcity)
    db.add(new_club)
    db.commit();
    db.refresh(new_club)
    return new_club
    

@router.get('/clubslist')
def clublist(db:Session= Depends(get_db)):
    clubs = db.query(models.Clubs).all()
    return clubs



