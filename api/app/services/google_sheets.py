from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from fastapi import HTTPException
import os
from dotenv import load_dotenv

load_dotenv()

ADMIN_EMAIL = os.getenv("ADMIN_EMAIL")


class GoogleSheetsService:
    def __init__(self, creds):
        self.sheets_service = build("sheets", "v4", credentials=creds)
        self.drive_service = build("drive", "v3", credentials=creds)

    def create_spreadsheet(self, spreadsheet_name: str, sheet_title: str):
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

    def rename_spreadsheet(self, spreadsheet_id: str, new_name: str):
        try:
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
        except HttpError as error:
            raise HTTPException(status_code=error.resp.status, detail=str(error))
        except Exception as e:
            raise HTTPException(status_code=400, detail=str(e))

    def delete_spreadsheet(self, spreadsheet_id: str):
        try:
            self.drive_service.files().delete(fileId=spreadsheet_id).execute()
        except HttpError as error:
            raise HTTPException(status_code=error.resp.status, detail=str(error))
        except Exception as e:
            raise HTTPException(status_code=400, detail=str(e))
