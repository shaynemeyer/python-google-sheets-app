from fastapi import FastAPI
from app.api.spreadsheets import router as spreadsheets_router
from app.api.worksheets import router as worksheets_router

app = FastAPI()

app.include_router(spreadsheets_router)
app.include_router(worksheets_router)
