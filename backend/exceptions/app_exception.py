from fastapi import HTTPException
from exceptions.app_exception_enum import AppExceptionEnum
class AppException(HTTPException):
    message: str
    status_code: int

    def __init__(self, appExceptionEnum: AppExceptionEnum) -> None:
        super().__init__(status_code=appExceptionEnum.status_code, detail=appExceptionEnum.message)
        self.status_code = appExceptionEnum.status_code
        self.message = appExceptionEnum.message