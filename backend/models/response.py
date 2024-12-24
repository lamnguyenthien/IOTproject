from pydantic import BaseModel
from typing import TypeVar, Generic

T = TypeVar('T')

class BaseResponse(BaseModel, Generic[T]):
    status_code: int
    message: str | None = None
    result: T | None = None
