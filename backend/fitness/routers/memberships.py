from fastapi import APIRouter
from fastapi.params import Depends
from sqlalchemy.orm import Session
from ..import models, schemas
from ..database import get_db
from passlib.context import CryptContext
from datetime import datetime

router = APIRouter() 

@router.post('/memberships')
def createMembership(request: schemas.MemberShips, db: Session = Depends(get_db)):
    current_datetime = datetime.now()
    new_membership = models.Memberships(description = request.description, membershiptype = request.membershiptype, amount = request.amount, createddate = current_datetime, nsid = request.nsid, validity = request.validity, sessions = request.sessions)
    db.add(new_membership)
    db.commit();
    db.refresh(new_membership)
    return new_membership
    
@router.get('/membershiplist')
def membershiplist(db:Session= Depends(get_db)):
    membershipslist = db.query(models.Memberships).all()
    return membershipslist





