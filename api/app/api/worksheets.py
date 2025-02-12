from fastapi import APIRouter, Path, Depends
from app.dependencies.sheets import get_google_sheets_service
from app.services.google_sheets import GoogleSheetsService

router = APIRouter(
    prefix="/api",
    tags=[
        "worksheets",
    ],
)


@router.get("/{spreadsheet_id}/worksheets")
def get_worksheets(
    spreadsheet_id: str = Path(
        ..., description="The Id of the Google Spreadsheets service"
    ),
    service: GoogleSheetsService = Depends(get_google_sheets_service),
):
    names = service.get_worksheet_names(spreadsheet_id)
    return {"worksheets": names}
