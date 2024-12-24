from passlib.context import CryptContext
from models.user import UserIn, UserDB
from schema.user_schemas import serializeUserDB
from config.database import collection_users
from exceptions.app_exception import AppException
from exceptions.app_exception_enum import AppExceptionEnum

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password):
    return pwd_context.hash(password)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

async def get_hash_user(user: UserIn):
    userdict = {**dict(user), "password": pwd_context.hash(user.password)}
    user_response = UserDB(**userdict)
    return user_response

async def verify_hash_user(user_in: UserIn):
    user = collection_users.find_one({"username": user_in.username})
    if user is None:
        raise AppException(AppExceptionEnum.NOT_FOUND)
    user_db = serializeUserDB(user)
    return pwd_context.verify(user_in.password, user_db["password"])   