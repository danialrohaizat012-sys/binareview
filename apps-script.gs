/**
 * Google Apps Script — simpan semua rating & maklum balas ke Google Sheet.
 * 1. Buka Google Sheet baru → Extensions → Apps Script → tampal kod ini.
 * 2. Deploy → New deployment → Web app → Execute as: Me, Access: Anyone.
 * 3. Salin URL web app → letak dalam CONFIG.sheetWebhook (index.html) atau ?hook=URL
 * (Pilihan) Isi OWNER_EMAIL untuk dapat emel setiap kali ada rating 1–3.
 */
const OWNER_EMAIL = "";

function doPost(e) {
  const d = JSON.parse(e.postData.contents);
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["Masa", "Kedai", "Jenis", "Rating", "Isu", "Mesej", "Hubungi", "Peranti"]);
  }
  sheet.appendRow([new Date(), d.shop, d.type, d.rating, d.issues || "", d.message || "", d.contact || "", d.ua || ""]);

  if (OWNER_EMAIL && d.type === "feedback") {
    MailApp.sendEmail(OWNER_EMAIL, `⚠️ Maklum balas ${d.rating}★ — ${d.shop}`,
      `Isu: ${d.issues || "-"}\n\n${d.message || "-"}\n\nHubungi: ${d.contact || "-"}`);
  }
  return ContentService.createTextOutput("ok");
}
