from fastapi import APIRouter
from fastapi.params import Depends
from sqlalchemy.orm import Session
from ..import models, schemas
from ..database import get_db
from passlib.context import CryptContext
from datetime import datetime
from requests_oauthlib import OAuth1Session
import json



router = APIRouter() 



@router.get('/nsconnect')
def nsconnect():
 
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
        "email": "est@gmail.com",
        "subsidiary": "42",
        "firstname": "estfirstname",
        "lastname": "estlastname",
        "mobilephone": "97150112145845",
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
        return response_json
    else:
        # Handle the case where the request was not successful
        return {"error": "Request failed with status code: " + str(res.status_code)}
