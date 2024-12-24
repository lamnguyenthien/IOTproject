from config.database import collection_data
from models.data import Data, PageData
from exceptions.app_exception import AppException
from exceptions.app_exception_enum import AppExceptionEnum
from dependencies.const import *
from routes.mqtt_client_route import fast_mqtt as client
import json
import pymongo

async def change_mode_device():
    client.publish(f"/device/mode", qos=1, retain=True)

async def turn_on_off_light():
    client.publish(f"/device/light", qos=1, retain=True)
    
async def turn_on_off_water_pump():
    client.publish(f"/device/water-pump", qos=1, retain=True)

async def add_wifi_to_device(username: str, password: str):
    try:
        client.publish(f"/device/wifi", payload=json.dumps({"username": username, "password": password}), qos=1, retain=True)
    except:
        raise AppException(AppExceptionEnum.CAN_NOT_CHANGE_STATE)

async def get_data_device(page: int = 0, size: int = 5) -> PageData:
    cursor = collection_data.find().sort("measure_time", pymongo.DESCENDING)
    totalPage = collection_data.estimated_document_count() // size
    dataDB = cursor.skip(page*size).limit(size).to_list(length=None) 
    if not dataDB:          
        raise AppException(AppExceptionEnum.NOT_FOUND)
    listData = [serialData(data) for data in dataDB]
    return PageData(current_page=page, total_page=totalPage, data=listData)

async def get_latest_data() -> list[Data]:
    cursor = collection_data.find().sort("measure_time", pymongo.DESCENDING).limit(5)
    dataDB = cursor.to_list(length=5)
    
    if not dataDB:
        raise AppException(AppExceptionEnum.NOT_FOUND)    
    return [serialData(data) for data in dataDB]

def serialData(data):
    return Data(
        temperature=data.get('temperature', 0.0),
        humidity=data.get('humidity', 0.0),
        moisture=data.get('moisture', 0.0),
        light=data.get('light', 0.0),
        measure_time=data.get('measure_time', 0),
        water=data.get('water', 0.0)
    )
