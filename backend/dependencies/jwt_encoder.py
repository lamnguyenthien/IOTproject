from jwt import encode, decode
from datetime import datetime, timedelta
from dependencies.const import VIETNAMESE_TIME_ZONE, ACCESS_TOKEN_EXPIRE_MINUTES, SECRET_KEY, ALGORITHM
from dependencies.user_depend import verify_hash_user
from models.user import UserIn
from models.token import Token
from exceptions.app_exception import AppException
from exceptions.app_exception_enum import AppExceptionEnum

def encode_token(data):
    iat = int(datetime.now(VIETNAMESE_TIME_ZONE).timestamp())
    exp = int((datetime.now(VIETNAMESE_TIME_ZONE) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)).timestamp())
    data.update({"iat": iat, "exp": exp})
    return encode(data, SECRET_KEY, algorithm=ALGORITHM)

def decode_token(token):
        return decode(token, SECRET_KEY, algorithms=[ALGORITHM])

async def create_jwt_token(userIn: UserIn):
    authenticate = await verify_hash_user(user_in=userIn)
    if not authenticate:
        raise AppException(AppExceptionEnum.UNAUTHORIZED)
    data = {
        "sub": userIn.username
    }
    encode_data = encode_token(data)
    return Token(token=encode_data)

async def get_role_user(token: str):
    try:
        data = decode_token(token)
        return data.get("role")
    except:
        raise AppException(AppExceptionEnum.UNAUTHORIZED)
    
async def get_username_user(token: str):
    try:
        data = decode_token(token)
        return data.get("sub")
    except:
        raise AppException(AppExceptionEnum.UNAUTHORIZED)