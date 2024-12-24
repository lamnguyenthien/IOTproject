from exceptions import app_exception
from fastapi import Request
from fastapi.responses import JSONResponse
from exceptions.app_exception_enum import AppExceptionEnum
from exceptions.app_exception import AppException
from typing import Callable

def create_exception_handler() -> Callable[[Request, AppException], JSONResponse]:
    async def exception_handler(request: Request, exc: AppException):
        return JSONResponse(
            status_code=exc.status_code,
            content={"message": exc.message, "status_code": exc.status_code}
        )
    return exception_handler