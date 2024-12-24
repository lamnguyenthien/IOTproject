from contextlib import asynccontextmanager
from fastapi import FastAPI
from routes import user_route, admin_route, device_route, websocket_route
from exceptions.app_exception_handler import create_exception_handler
from exceptions.app_exception import AppException
from dependencies.mqtt_server import iot_broker
from routes.mqtt_client_route import fast_mqtt as client
from security.authorization_middleware import AuthorizationMiddleware
from fastapi.middleware.cors import CORSMiddleware
import anyio

@asynccontextmanager
async def lifespan(app: FastAPI):
    async with anyio.create_task_group() as tg:   
        tg.start_soon(iot_broker)  # Start the MQTT broker as a background tas
        tg.start_soon(client.mqtt_startup)
        yield  
        tg.cancel_scope.cancel()

app = FastAPI(lifespan=lifespan)

app.include_router(user_route.router)
app.include_router(admin_route.router)
app.include_router(device_route.router)
app.include_router(websocket_route.router)
app.add_exception_handler(AppException, create_exception_handler())
app.add_middleware(AuthorizationMiddleware)
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])