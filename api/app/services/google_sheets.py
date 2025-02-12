from googleapiclient.discovery import build
from typing import List
import os
from dotenv import load_dotenv

load_dotenv()

ADMIN_EMAIL = os.getenv("ADMIN_EMAIL")


class GoogleSheetsService:
    def __init__(self, creds):
        self.sheets_service = build("sheets", "v4", credentials=creds)
        self.drive_service = build("drive", "v3", credentials=creds)

    def create_spreadsheet(self, spreadsheet_name: str, sheet_title: str):
        body = {
            "properties": {"title": spreadsheet_name},
            "sheets": [{"properties": {"title": sheet_title}}],
        }

        response = self.sheets_service.create(body=body).execute()

        spreadsheet_id = response["spreadsheetId"]
        share_link = response["spreadsheetUrl"]

        permission = {
            "role": "writer",
            "type": "user",
            "emailAddress": ADMIN_EMAIL,
        }

        # Share the spreadsheet with anyone
        # permission = {
        #     "role": "writer",
        #     "type": "anyone",
        # }

        self.drive_service.permissions().create(
            fileId=spreadsheet_id, body=permission
        ).execute()

        return spreadsheet_id, share_link

    def rename_spreadsheet(self, spreadsheet_id: str, new_name: str):
        request_body = {
            "requests": [
                {
                    "updateSpreadsheetProperties": {
                        "properties": {"title": new_name},
                        "fields": "title",
                    }
                }
            ]
        }

        result = self.sheets_service.batchUpdate(
            spreadsheetId=spreadsheet_id,
            body=request_body,
        ).execute()

        return result

    def delete_spreadsheet(self, spreadsheet_id: str):
        self.drive_service.files().delete(fileId=spreadsheet_id).execute()

    def get_worksheet_names(self, spreadsheet_id: str) -> List[str]:
        metadata = self.sheets_service.get(spreadsheetId=spreadsheet_id).execute()
        worksheets = metadata.get("sheets", [])
        worksheet_names = [sheet["properties"]["title"] for sheet in worksheets]
        return worksheet_names
