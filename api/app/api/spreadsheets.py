from fastapi import APIRouter, Depends
from app.dependencies.sheets import get_google_sheets_service
from app.services.google_sheets import GoogleSheetsService
from app.models.base import CreateSheetRequest, RenameRequest

router = APIRouter(prefix="/api", tags=["spreadsheets"])


@router.get("/spreadsheets/create")
def create_spreadsheet(
    request: CreateSheetRequest,
    service: GoogleSheetsService = Depends(get_google_sheets_service),
):
    # spreadsheet_id, url = service.create_sheet("Beautiful title", "sheet name")
    spreadsheet_id, url = service.create_spreadsheet(
        request.spreadsheet_name, request.sheet_title
    )

    return {"spreadsheet_id": spreadsheet_id, "url": url}


from fastapi import Path, Body


@router.put("/spreadsheets/{spreadsheet_id}/rename")
def rename_spreadsheet(
    spreadsheet_id: str = Path(..., description="The ID of the Google Spreadsheet"),
    request: RenameRequest = Body(..., description="The new name for the Spreadsheet"),
    service: GoogleSheetsService = Depends(get_google_sheets_service),
):
    result = service.rename_spreadsheet(spreadsheet_id, request.new_name)

    return {"result": result}


@router.delete("/spreadsheets/{spreadsheet_id}")
def delete_spreadsheet(
    spreadsheet_id: str = Path(..., description="The ID of the Google Spreadsheet"),
    service: GoogleSheetsService = Depends(get_google_sheets_service),
):
    service.delete_spreadsheet(spreadsheet_id)

    return {"message": "Spreadsheet deleted successfully"}
