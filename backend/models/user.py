from pydantic import BaseModel 
class BaseUser(BaseModel):
    username: str
    email: str | None = None
    fullname: str | None = None

class UserIn(BaseUser):
    password: str

class UserDB(BaseUser):
    password: str
