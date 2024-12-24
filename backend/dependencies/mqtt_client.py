from fastapi_mqtt.config import MQTTConfig
from fastapi_mqtt.fastmqtt import FastMQTT
import json
fast_mqtt = FastMQTT(config=MQTTConfig(host="localhost", port=1883))

@fast_mqtt.on_connect()
def connect(client, flags, rc, properties):
    fast_mqtt.client.subscribe("test") #subscribing mqtt topic
    #logic
    print("Connected: ", client, flags, rc, properties)

@fast_mqtt.on_message()
async def message(client, topic, payload, qos, properties):
    print("Received message: ",topic, payload.decode(), qos, properties)
    data = json.loads(payload.decode())
    
    control_data = {
        'water_pump': False,  # điều khiển bơm nước
        'light': False,       # điều khiển đèn chiếu sáng
        'heater': False       # điều khiển đèn sưởi
    }

    temperature = data.get('temperature')
    humidity = data.get('humidity')
    soil_moisture = data.get('moisture')
    light = data.get('light')
    autoMode = data.get('autoMode')
    distance = data.get('distance')
    if(autoMode == 1):
    
        if temperature > 25 and soil_moisture < 30:
            print("Bật tưới cây do nhiệt độ cao và đất khô")
            control_data['water_pump'] = True  
        elif soil_moisture > 60:
            print("Tắt tưới cây do đất đủ ẩm")
            control_data['water_pump'] = False  

        # if temperature < 18 and light < 200:
        #     control_data['heater'] = True  
        # elif temperature > 25 or light > 500:
        #     control_data['heater'] = False  

        if light >=2200 and humidity > 60:
            control_data['light'] = True 
        elif light < 2200:
            control_data['light'] = False 

        if temperature > 25 and soil_moisture < 30:
            control_data['water_pump'] = True

        if distance > 40:
            control_data['water_pump'] = False
        # Publish kết quả điều khiển cho ESP32
        fast_mqtt.publish("esp32/control", json.dumps(control_data))
        print("Đã gửi phản hồi đến ESP32:", control_data)
    else:
        if distance > 40:
            fast_mqtt.publish("esp32/control", json.dumps({'water_pump': False}))
            print("Đã gửi phản hồi đến ESP32: water_pump:False", )
    return 0

@fast_mqtt.subscribe("my/mqtt/topic/#")
async def message_to_topic(client, topic, payload, qos, properties):
    print("Received message to specific topic: ", topic, payload.decode(), qos, properties)

@fast_mqtt.on_disconnect()
def disconnect(client, packet, exc=None):
    print("Disconnected")

@fast_mqtt.on_subscribe()
def subscribe(client, mid, qos, properties):
    print("subscribed", client, mid, qos, properties)