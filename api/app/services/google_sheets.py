from googleapiclient.discovery import build
from fastapi import HTTPException
import os
from dotenv import load_dotenv

load_dotenv()

ADMIN_EMAIL = os.getenv("ADMIN_EMAIL")


class GoogleSheetsService:
    def __init__(self, creds):
        self.sheets_service = build("sheets", "v4", credentials=creds)
        self.drive_service = build("drive", "v3", credentials=creds)

    def create_sheet(self, spreadsheet_name: str, sheet_title: str):
        try:
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
        except Exception as e:
            raise HTTPException(status_code=400, detail=str(e))
