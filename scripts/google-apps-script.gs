/**
 * Doctors Build International — lead capture into Google Sheets
 *
 * SETUP
 * 1. Create a new Google Sheet. Name the first tab "Leads".
 * 2. Extensions → Apps Script. Delete the placeholder and paste this file.
 * 3. Deploy → New deployment → type "Web app".
 *      Execute as:      Me
 *      Who has access:  Anyone
 * 4. Copy the /exec URL it gives you.
 * 5. Put it in .env.local as  SHEETS_WEBHOOK_URL=<that url>
 * 6. Redeploy the site (or restart `npm run dev`).
 *
 * Every enquiry from the website will then append a row here, and the
 * site keeps working exactly the same if this is ever removed.
 */

var SHEET_NAME = 'Leads';

var HEADERS = [
  'Received At (IST)',
  'Name',
  'Phone',
  'Email',
  'City',
  'NEET Score',
  'Interested In',
  'Message',
  'Source Page',
  'IP',
  'User Agent',
];

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var sheet = getSheet_();

    sheet.appendRow([
      formatIst_(data.receivedAt),
      data.name || '',
      "'" + (data.phone || ''), // leading apostrophe keeps +91 intact
      data.email || '',
      data.city || '',
      data.neetScore || '',
      data.interest || '',
      data.message || '',
      data.source || '',
      data.ip || '',
      data.userAgent || '',
    ]);

    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

function doGet() {
  return json_({ ok: true, service: 'Doctors Build International lead capture' });
}

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    var header = sheet.getRange(1, 1, 1, HEADERS.length);
    header.setFontWeight('bold');
    header.setBackground('#0A1F44');
    header.setFontColor('#FFFFFF');
    sheet.setFrozenRows(1);
    sheet.autoResizeColumns(1, HEADERS.length);
  }

  return sheet;
}

function formatIst_(iso) {
  var d = iso ? new Date(iso) : new Date();
  return Utilities.formatDate(d, 'Asia/Kolkata', 'dd MMM yyyy, HH:mm');
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}
