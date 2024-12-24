from fastapi import APIRouter, status, Depends
from models.response import BaseResponse
from models.data import Data
from dependencies.device_depend import *
from typing import Annotated
from routes.mqtt_client_route import fast_mqtt as client
router = APIRouter(prefix="/device")
 
@router.post("/add-wifi")
async def add_wifi_to_device(state: Annotated[None, Depends(add_wifi_to_device)]) -> BaseResponse:
    return BaseResponse(status_code=status.HTTP_200_OK, message="Waiting for adding wifi to device. You can check the status of the device in a few minutes")

@router.post("/change-mode")
async def change_mode_device(state: Annotated[None, Depends(change_mode_device)]) -> BaseResponse:
    return BaseResponse(status_code=status.HTTP_200_OK, message="Waiting for changing mode of device. You can check the status of the device in a few minutes")

@router.post("/light")
async def turn_on_off_light(state: Annotated[None, Depends(turn_on_off_light)]) -> BaseResponse:
    return BaseResponse(status_code=status.HTTP_200_OK, message="Waiting for turning on/off light. You can check the status of the device in a few minutes")

@router.post("/water-pump")
async def turn_on_off_water_pump(state: Annotated[None, Depends(turn_on_off_water_pump)]) -> BaseResponse:
    return BaseResponse(status_code=status.HTTP_200_OK, message="Waiting for turning on/off water pump. You can check the status of the device in a few minutes")

@router.get("/data") 
async def get_data_device(data: Annotated[Data, Depends(get_data_device)]) -> BaseResponse:
    return BaseResponse(status_code=status.HTTP_200_OK, result=data)

@router.get("/data/latest")
async def get_latest_data_device(data: Annotated[Data, Depends(get_latest_data)]) -> BaseResponse:
    return BaseResponse(status_code=status.HTTP_200_OK, result=data)