from fastapi import APIRouter, WebSocket
from dependencies.connection_manager import connection_manager
import logging
router = APIRouter()

@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await connection_manager.connect("test", websocket)
    while True:
        data = await websocket.receive_text()
        await websocket.send_text(f"Message text was: {data}")

@router.websocket("/ws/data")
async def websocket_endpoint(websocket: WebSocket):
    await connection_manager.connect(f'ws/data', websocket)
    try:
        while True:
            data = await websocket.receive_text()
            logging.info(f"Received message from device: {data}")
            await websocket.send_text(f"Message text was: {data}")
    except Exception as e:
        print(f"Error: {str(e)}")
        await connection_manager.disconnect(f'ws/data', websocket)

@router.websocket("/ws/status")
async def websocket_endpoint(websocket: WebSocket):
    await connection_manager.connect(f'ws/status', websocket)
    try: 
        while True:
            data = await websocket.receive_text()
            await websocket.send_text(f"Message text was: {data}")
    except Exception as e:
        print(f"Error: {str(e)}")
        await connection_manager.disconnect(f'ws/status', websocket)