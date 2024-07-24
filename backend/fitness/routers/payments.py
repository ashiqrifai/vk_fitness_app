from fastapi import APIRouter
from fastapi.params import Depends
from sqlalchemy.orm import Session
from ..import models, schemas
from ..database import get_db
from passlib.context import CryptContext
from datetime import datetime



router = APIRouter()


@router.post('/createPayment')
def createPayment(request: schemas.PaymentMethods, db: Session = Depends(get_db)):
    
    new_paymentmethod = models.PaymentMethods(payment_description = request.payment_description)
    db.add(new_paymentmethod)
    db.commit();
    db.refresh(new_paymentmethod)
    return new_paymentmethod

@router.get('/paymentmethods')
def paymentmethods(db:Session= Depends(get_db)):
    paymentmethods = db.query(models.PaymentMethods).all()
    return paymentmethods



