from fastapi import APIRouter
from typing import Annotated
from models.user import *
from dependencies.user_depend import get_hash_user
from models.response import BaseResponse
from exceptions.app_exception import AppException
from exceptions.app_exception_enum import AppExceptionEnum
from fastapi import Depends, status
from schema.user_schemas import listSerializeBaseUser
from config.database import collection_users

router = APIRouter(prefix="/admin")

@router.post("/new-user")
async def create_user(user: Annotated[UserDB, Depends(get_hash_user)]) -> BaseResponse[BaseUser | None]:
    if user.email is None or user.fullname is None or user.role is None:
        raise AppException(AppExceptionEnum.BAD_REQUEST)
    try:
        collection_users.insert_one(dict(user))
    except:
        raise AppException(AppExceptionEnum.UNAUTHORIZED)
    return BaseResponse[BaseUser](status_code=status.HTTP_201_CREATED, message="Create new user successfully", result=user)

@router.get("/users")
async def get_users() -> BaseResponse[list[BaseUser]]:
    users = listSerializeBaseUser(collection_users.find({}))
    return BaseResponse[list](status_code=status.HTTP_200_OK, result=users)