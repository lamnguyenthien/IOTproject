from fastapi_mqtt.config import MQTTConfig
from fastapi_mqtt.fastmqtt import FastMQTT
from dependencies.const import VIETNAMESE_TIME_ZONE
from config.database import collection_data
from datetime import datetime
from json import loads as json_loads, dumps
import json
from dependencies.connection_manager import connection_manager
from models.data import Data
fast_mqtt = FastMQTT(config=MQTTConfig(host="localhost", port=1883))

@fast_mqtt.on_connect()
def connect(client, flags, rc, properties):
    print("Connected: ", client, flags, rc, properties)

@fast_mqtt.on_disconnect()
def disconnect(client, packet, exc=None):
    print("Disconnected")

@fast_mqtt.on_subscribe()
def subscribe(client, mid, qos, properties):
    print("subscribed", client, mid, qos, properties)

@fast_mqtt.subscribe("/device/data", qos = 1)
async def message_from_device(client, topic, payload, qos, properties):
    data = json.loads(payload.decode())

    control_data = {
        'water_pump': False,
        'light': False,       
    }

    temperature = data.get('temperature')
    humidity = data.get('humidity')
    soil_moisture = data.get('moisture')
    light = data.get('light')
    autoMode = data.get('autoMode')
    distance = data.get('water')

# Calculate water level and update the `data` dictionary
    water_level = round(6 - distance, 2)
    data['water'] = water_level
    # print(dataDB)
    dataDB = Data(
        temperature=temperature,
        humidity=humidity,
        moisture=soil_moisture,
        light=light,
        measure_time=int(datetime.now(VIETNAMESE_TIME_ZONE).timestamp()), 
        water=water_level
    )
    collection_data.insert_one(dict(dataDB))

    if(autoMode == 1):
        if temperature > 25 and soil_moisture < 30:
            print("Bật tưới cây do nhiệt độ cao và đất khô")
            control_data['water_pump'] = True  
        elif soil_moisture > 60:
            print("Tắt tưới cây do đất đủ ẩm")
            control_data['water_pump'] = False  

        if light >=2200:
            control_data['light'] = True 
        elif light < 2200:
            control_data['light'] = False 

        if water_level < 2:
            control_data['water_pump'] = False

        fast_mqtt.publish("esp32/control", json.dumps(control_data))
        print("Đã gửi phản hồi đến ESP32:", control_data)
    else:
        if water_level < 2:
            fast_mqtt.publish("esp32/control", json.dumps({'water_pump': False}))
            print("Đã gửi phản hồi đến ESP32: water_pump:False", )

    import asyncio
    loop = asyncio.get_event_loop()
    loop.create_task(connection_manager.send_personal_message(data, f"ws/data"))
    print(f"Received message from device: {payload.decode()}")

@fast_mqtt.subscribe("/device/status", qos=1)
async def message_from_device(client, topic, payload, qos, properties):
    data = json_loads(payload.decode())
    data["led"] = data["led"] == 1
    data["pump"] = data["pump"] == 1
    data["manual"] = data["manual"] == 0
    import asyncio
    loop = asyncio.get_event_loop()
    loop.create_task(connection_manager.send_personal_message(data, f"ws/status"))
    print(f"Received message from device: {payload.decode()}")

