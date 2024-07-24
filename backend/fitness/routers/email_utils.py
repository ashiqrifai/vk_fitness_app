import os
import smtplib
from email.mime.text import MIMEText
from dotenv import load_dotenv
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import smtplib
import re


load_dotenv()

EMAIL_HOST = "smtp.office365.com"
EMAIL_PORT = "587"
EMAIL_HOST_USER = "ashik@nbventuresme.com"
EMAIL_HOST_PASSWORD ="Welcome123"
EMAIL_FROM = "ashik@nbventuresme.com"
EMAIL_SUBJECT = "Reset Password Request"

def send_reset_email(to_email: str, token: str):
    reset_link = f"http://snapfitnessuae/reset-password?token={token}"
    message = f"Click the following link to reset your password: {reset_link}"

    from_email = "ashik@nbventuresme.com"  # Replace with your email
    password = "Welcome123"  # Replace with your email password

    msg = MIMEMultipart()
    msg["From"] = from_email
    msg["To"] = to_email
    msg["Subject"] = "Password Reset Request"

    msg.attach(MIMEText(message, "plain"))

    with smtplib.SMTP("smtp.office365.com", 587) as server:  # Replace with your SMTP server
        server.starttls()
        server.login(from_email, password)
        server.sendmail(from_email, to_email, msg.as_string())