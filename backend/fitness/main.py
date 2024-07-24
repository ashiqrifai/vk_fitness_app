import select
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import date, datetime
from typing import List

from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session, relationship
from sqlalchemy import null, text, and_
from passlib.context import CryptContext
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig

from . import models
from .database import engine, SessionLocal, get_db
from . import schemas
from .routers import users, memberships, clubs, members, transaction, ns_data, payments, products

app = FastAPI()

app.include_router(users.router)
app.include_router(memberships.router)
app.include_router(clubs.router)
app.include_router(members.router)
app.include_router(transaction.router)
app.include_router(ns_data.router)
app.include_router(payments.router)
app.include_router(products.router)

origins = [
    "http://localhost",
    "http://localhost:3000",
    "http://192.168.54.231:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


models.Base.metadata.create_all(engine)
