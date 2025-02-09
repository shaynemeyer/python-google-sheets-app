from fastapi import FastAPI, Depends
from app.dependencies.sheets import get_google_sheets_service
from app.services.google_sheets import GoogleSheetsService

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "everything looks good!"}

@app.get("/test")
def read_root(
    service: GoogleSheetsService = Depends(get_google_sheets_service)
):
    return {"message": repr(service.sheets_service)}
