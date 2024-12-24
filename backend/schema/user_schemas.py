from models.user import UserDB, BaseUser

def serializeUserDB(user):
    return {
        "username": user["username"],
        "id": str(user["_id"]),
        "password": user["password"],
        "fullname": user["fullname"],
        "email": user["email"]
    }

def listSerializeUserDB(users) -> list:
    return [serializeUserDB(user) for user in users]

def listSerializeBaseUser(users) -> list:
    return [BaseUser(**serializeUserDB(user)) for user in users]
