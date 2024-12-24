import asyncio
from fastapi import WebSocket
import logging

class ConnectionManager:
    def __init__(self):
        self.active_connections: dict[str, list[WebSocket]] = {}

    async def connect(self, topic: str, websocket: WebSocket):
        await websocket.accept()
        if topic not in self.active_connections:
            self.active_connections[topic] = []  # Khởi tạo danh sách nếu chưa có topic
        self.active_connections[topic].append(websocket)  # Thêm websocket vào danh sách

    async def disconnect(self, topic: str, websocket: WebSocket):
        if topic in self.active_connections:
            self.active_connections[topic].remove(websocket)
            if not self.active_connections[topic]:  # Xóa topic nếu không còn kết nối nào
                del self.active_connections[topic]

    async def send_personal_message(self, message, topic: str):
        if topic in self.active_connections:
            logging.info(f"Sending message to {topic}")
            await asyncio.gather(*[websocket.send_json(message) for websocket in self.active_connections[topic]])
            logging.info(f"Message sent to {topic}")

    async def broadcast(self, message, topic: str):
        if topic in self.active_connections:
            await asyncio.gather(*[websocket.send_json(message) for websocket in self.active_connections[topic]])

connection_manager = ConnectionManager()