from fastapi import FastAPI
from app.api.spreadsheets import router as spreadsheets_router

app = FastAPI()

app.include_router(spreadsheets_router)
