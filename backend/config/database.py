from pymongo import MongoClient, errors
client = MongoClient("mongodb+srv://nhomiot20:U0AwvWipK3b6G6NB@cluster0.z8dbt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")

db = client.IOT_DATABASE

collection_users = db["users_collection"]
collection_data = db["data_collection"]

try:
    collection_users.create_index('username', unique=True)
except errors.CollectionInvalid:
    print('Error to create unique username')