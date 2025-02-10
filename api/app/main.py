from fastapi import FastAPI, Depends
from app.dependencies.sheets import get_google_sheets_service
from app.services.google_sheets import GoogleSheetsService
from app.models.base import CreateSheetRequest

app = FastAPI()


@app.get("/")
def read_root():
    return {"message": "everything looks good!"}


@app.get("/test")
def read_test(
    request: CreateSheetRequest,
    service: GoogleSheetsService = Depends(get_google_sheets_service),
):
    # spreadsheet_id, url = service.create_sheet("Beautiful title", "sheet name")
    spreadsheet_id, url = service.create_sheet(
        request.spreadsheet_name, request.sheet_title
    )

    return {"sheet_id": spreadsheet_id, "url": url}
