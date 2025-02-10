from pydantic import BaseModel

class CreateSheetRequest(BaseModel):
    spreadsheet_name: str = "Untitled"
    sheet_title: str = "first"