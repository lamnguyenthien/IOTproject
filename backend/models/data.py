from pydantic import BaseModel

class Data(BaseModel):
    temperature: float
    humidity: float
    moisture: float
    light: float
    water: float
    measure_time: float

class PageData(BaseModel):
    current_page: int
    total_page: int
    data: list[Data]