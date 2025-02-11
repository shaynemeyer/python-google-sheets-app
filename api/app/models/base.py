from pydantic import BaseModel


class CreateSheetRequest(BaseModel):
    spreadsheet_name: str = "Untitled"
    sheet_title: str = "first"


class RenameRequest(BaseModel):
    new_name: str
