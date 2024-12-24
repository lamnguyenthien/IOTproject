from fastapi import APIRouter, status, Depends

from models.user import *
from models.token import *
from models.response import BaseResponse
from typing import Annotated
from dependencies.jwt_encoder import create_jwt_token

router = APIRouter(prefix="/user")

@router.post("/authenticate")
async def authenticate(authenticate: Annotated[str, Depends(create_jwt_token)]) -> BaseResponse[Token | None]:
    if authenticate:
        return BaseResponse(status_code=status.HTTP_200_OK, message="Login successfully", result=authenticate)
    return BaseResponse(status_code=status.HTTP_400_BAD_REQUEST, message="Login fail")