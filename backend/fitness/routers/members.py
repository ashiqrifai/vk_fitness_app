from http.client import HTTPException
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

@router.post('/createMember')
async def createMember(request: schemas.Member, db: Session = Depends(get_db)):
    current_datetime = datetime.now()
    new_member = models.Members(firstname = request.firstname, lastname = request.lastname, mobilenumber = request.mobilenumber, email = request.email, club_id = request.club_id, barcode = request.barcode, createdate = current_datetime)
    db.add(new_member)
    db.commit()
    db.refresh(new_member)
    new_db = SessionLocal()
    #generate_signature(request.email, request.firstname, request.lastname, request.mobilenumber, new_member.id, db=new_db)

    club = db.query(models.Clubs).filter(models.Clubs.id == new_member.club_id).first()
    if not club:
        raise HTTPException(status_code=404, detail="Club not found")

    return {
        "id": new_member.id,
        "firstname": new_member.firstname,
        "lastname": new_member.lastname,
        "mobilenumber": new_member.mobilenumber,
        "email": new_member.email,
        "club_id": new_member.club_id,
        "barcode": new_member.barcode,
        "createdate": new_member.createdate,
        "club_name": club.clubname
    }


    
@router.get('/memberlist/{club_id}')
def memberlist(club_id: int, db: Session = Depends(get_db)):
    members = db.query(models.Members, models.Clubs) \
                .join(models.Clubs, models.Members.club_id == models.Clubs.id) \
                .filter(models.Members.club_id == club_id).all()
    member_list = []

    for member, club in members:
        member_dict = {
            "id": member.id,
            "firstname": member.firstname,
            "lastname": member.lastname,
            "mobilenumber": member.mobilenumber,
            "email": member.email,
            "club_id": member.club_id,
            "barcode": member.barcode,
            "createdate": member.createdate,
            "club_name": club.clubname  # Include the club name
        }

        member_list.append(member_dict)
   
    return member_list

def generate_signature(
        email,
        firstname, 
        lastname, 
        mobile,
        memberid,
        db: Session
):

    CLIENT_KEY: str = "00cee4d799f65195559b12d50f0b0e2b61a3afaac69846abb84bd9e532702133"
    CLIENT_SECRET: str = "47969b5cf2298718bc14821b52e94701c9fda2a4cb830aaba021a25664571b1b"
    ACCESS_KEY: str = "b767c6fc01ae4c23072e388d38caead197d4d87304fee6d962fb0918eea81473"
    ACCESS_SECRET: str = "194f376375581106515c3e99151a91ebf4cfb77a7f0ae053a4871dc9cc867088"
    SIGNATURE_METHOD: str = "HMAC-SHA256"
    REALM_ID: str = "4971506_SB1"
    SCRIPT_ID: int = 1
    DEPLOY_ID: int = 1

    URL: str = f"https://4971506-sb1.restlets.api.netsuite.com/app/site/hosting/restlet.nl?script=1765&deploy=1"

    oauth = OAuth1Session(
        client_key=CLIENT_KEY,
        client_secret=CLIENT_SECRET,
        resource_owner_key=ACCESS_KEY,
        resource_owner_secret=ACCESS_SECRET,
        realm="4971506_SB1",
        signature_method=SIGNATURE_METHOD
    )

    data = [
    {
        "currency": "1",
        "email": email,
        "subsidiary": "42",
        "firstname": firstname,
        "lastname": lastname,
        "mobilephone": mobile,
        "address": [
            {
                "city": "",
                "addr1": "",
                "addr2": "",
                "addr3": ""
            },
            {
                "city": "",
                "addr1": "",
                "addr2": "",
                "addr3": ""
            }
        ]
    }
]

    headers = {
        "Content-Type": "application/json"
    }

    res = oauth.post(URL, data=json.dumps(data), headers=headers)
    
    if res.status_code == 200:
        # Parse the JSON response content
        response_json = json.loads(res.content)
        customer_id = response_json["customerId"]
        new_ns_member = models.NSMembers(member_id=memberid, nsid=customer_id)
        db.add(new_ns_member)
        db.commit()
        db.refresh(new_ns_member)

        

    
        return response_json
    else:
        # Handle the case where the request was not successful
        return {"error": "Request failed with status code: " + str(res.status_code)}

    





