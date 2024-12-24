from enum import Enum
from fastapi import status # type: ignore

class AppExceptionEnum(Enum):
    UNAUTHORIZED = ("The user is unauthorized", status.HTTP_401_UNAUTHORIZED)
    BAD_REQUEST = ("This is an bad request", status.HTTP_400_BAD_REQUEST)
    NOT_FOUND = ("The data is not found", status.HTTP_404_NOT_FOUND)
    CAN_NOT_CREATE = ("Can not create new data", status.HTTP_400_BAD_REQUEST)
    CAN_NOT_UPDATE = ("Can not update data", status.HTTP_400_BAD_REQUEST)   
    CAN_NOT_CHANGE_STATE = ("Can not change state", status.HTTP_400_BAD_REQUEST)

    def __init__(self, message, code) -> None:
        super().__init__()
        self.message = message
        self.status_code = code