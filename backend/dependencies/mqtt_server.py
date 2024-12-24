from moat.mqtt.broker import create_broker
import logging
import yaml
import anyio

with open('config.yaml', 'r') as file:
    config = yaml.safe_load(file)

async def iot_broker():  
    try:
        async with create_broker(config=config.get("broker", {})) as broker:
            logging.info("MQTT Broker started successfully.")
            await anyio.Event().wait()     
    except Exception as e:
        logging.error(f"Error starting MQTT Broker: {e}")