from starlette.middleware.base import BaseHTTPMiddleware
from starlette.exceptions import HTTPException
from dependencies.jwt_encoder import decode_token
from config.database import collection_users
from exceptions.app_exception import AppException
from exceptions.app_exception_enum import AppExceptionEnum
from starlette.responses import JSONResponse
from datetime import time, datetime

public_endpoints = ["/user/authenticate", "/admin/new-user"]
admin_endpoints = ["/admin/**"]

def exception_handler(exc: AppException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"message": exc.message, "status_code": exc.status_code}
    )

def is_user_not_exist(username: str):
    return collection_users.find_one({"username": username})

def is_token_expried(exp: int):
    return datetime.fromtimestamp(exp) < datetime.now()

class AuthorizationMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        # if request.url.path in public_endpoints:
        #     return await call_next(request)
        # auth = request.headers.get("Authorization")
        # if not auth or auth.startswith("Bearer") is False:
        #     return exception_handler(AppException(AppExceptionEnum.UNAUTHORIZED))
        # token = auth.split(" ")[1]
               
        # try:
        #     payload = decode_token(token)
        #     username = payload.get("sub", "")
        #     exp = payload.get("exp", 0)
        #     if is_user_not_exist(username) is None or is_token_expried(exp):
        #         return exception_handler(AppException(AppExceptionEnum.UNAUTHORIZED))
        #     print("AuthorizationMiddleware: ", request.url.path)
        #     return await call_next(request)
        # except Exception as e:
        #     print(f"Error during call_next: {e}")
        #     return exception_handler(AppException(AppExceptionEnum.UNAUTHORIZED))
        return await call_next(request)