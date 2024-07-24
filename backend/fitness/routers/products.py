from fastapi import APIRouter
from fastapi.params import Depends
from sqlalchemy.orm import Session
from ..import models, schemas
from ..database import get_db, SessionLocal
from passlib.context import CryptContext
from datetime import datetime
from requests_oauthlib import OAuth1Session
import json

router = APIRouter()

@router.post('/createProduct')
def createproduct(request: schemas.Products, db: Session = Depends(get_db)):
    current_datetime = datetime.now()
    new_product = models.Products(itemname = request.itemname, amount = request.amount, createdate = current_datetime)
    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    return new_product

@router.get('/productlist')
def productlist(db:Session= Depends(get_db)):
    products = db.query(models.Products).all()
    return products

@router.post('/createDiscount')
def creatediscount(request: schemas.Discounts, db: Session = Depends(get_db)):
    current_datetime = datetime.now()
    new_discount = models.Discounts(description = request.description, createdate = current_datetime)
    db.add(new_discount)
    db.commit()
    db.refresh(new_discount)
    return new_discount    

@router.get('/discountlist')
def discountlist(db: Session = Depends(get_db)):
    discounts = db.query(models.Discounts).all()
    return discounts

