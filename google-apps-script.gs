/**
 * Beauty Queen — Google Apps Script
 *
 * Sheet columns:
 * id | تاریخ | نام و نام خانوادگی | شماره تماس | ایمیل | تایتل | توضیحات | بررسی وضعیت
 *
 * Before deploying:
 * 1) Replace SHEET_ID with your Google Sheet ID.
 * 2) Make sure the sheet name matches SHEET_NAME.
 * 3) Deploy as Web app:
 *    Execute as: Me
 *    Who has access: Anyone
 */

const SHEET_ID = "PASTE_YOUR_GOOGLE_SHEET_ID_HERE";
const SHEET_NAME = "Sheet1";

function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({
      ok: true,
      message: "Beauty Queen lead endpoint is running."
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
    if (!sheet) throw new Error("Sheet not found: " + SHEET_NAME);

    const data = JSON.parse(e.postData.contents || "{}");

    const id = Utilities.getUuid();
    const now = new Date();

    // Timestamp format follows the spreadsheet/script timezone.
    const timestamp = Utilities.formatDate(
      now,
      Session.getScriptTimeZone() || "Asia/Tehran",
      "yyyy-MM-dd HH:mm:ss"
    );

    sheet.appendRow([
      id,
      timestamp,
      data.name || "",
      data.phone || "",
      data.email || "",
      data.title || "",
      data.description || "",
      "جدید"
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({
        ok: true,
        id: id,
        timestamp: timestamp
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        ok: false,
        error: error.message
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
