/**
 * BinaReview — Google Apps Script (simpan rating & pangkalan data pelanggan ke Google Sheet)
 *
 * 1. Buka Google Sheet baru → Extensions → Apps Script → tampal kod ini.
 * 2. Deploy → New deployment → Web app → Execute as: Me, Who has access: Anyone.
 * 3. Salin URL web app → letak dalam CONFIG.sheetWebhook (index.html) atau ?hook=URL
 *
 * Tab yang dicipta automatik:
 *   "Log"       — setiap tap, rating, klik Google & maklum balas
 *   "Pelanggan" — senarai pelanggan unik (ikut no. telefon): jumlah lawatan, rating terakhir, setuju promosi
 *
 * (Pilihan) Isi OWNER_EMAIL untuk dapat emel setiap kali ada maklum balas 1–3★.
 */
const OWNER_EMAIL = "";

function doPost(e) {
  const d = JSON.parse(e.postData.contents);
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const now = new Date();

  const log = getSheet_(ss, "Log",
    ["Masa", "Kedai", "Pakej", "Jenis", "Nama", "Telefon", "Setuju promosi", "Rating", "Isu", "Mesej", "Peranti"]);
  log.appendRow([now, d.shop, d.plan, d.type, d.name || "", d.phone ? "+" + d.phone : "", d.optin || "",
    d.rating || "", d.issues || "", d.message || "", d.ua || ""]);

  if (d.phone) upsertCustomer_(ss, d, now);

  if (OWNER_EMAIL && d.type === "feedback") {
    MailApp.sendEmail(OWNER_EMAIL, `⚠️ Maklum balas ${d.rating}★ — ${d.shop}`,
      `Nama: ${d.name}\nTel: +${d.phone}\nIsu: ${d.issues || "-"}\n\n${d.message || "-"}`);
  }
  return ContentService.createTextOutput("ok");
}

function upsertCustomer_(ss, d, now) {
  const sh = getSheet_(ss, "Pelanggan",
    ["Telefon", "Nama", "Kedai", "Setuju promosi", "Lawatan", "Rating terakhir", "Kali pertama", "Kali terakhir"]);
  const phone = "+" + d.phone;
  const rows = sh.getDataRange().getValues();
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][0] === phone && rows[i][2] === d.shop) {
      const r = i + 1;
      sh.getRange(r, 2).setValue(d.name);
      sh.getRange(r, 4).setValue(d.optin);
      if (d.type === "checkin") sh.getRange(r, 5).setValue((rows[i][4] || 0) + 1);
      if (d.rating) sh.getRange(r, 6).setValue(d.rating);
      sh.getRange(r, 8).setValue(now);
      return;
    }
  }
  sh.appendRow([phone, d.name, d.shop, d.optin, 1, d.rating || "", now, now]);
}

function getSheet_(ss, name, headers) {
  let sh = ss.getSheetByName(name);
  if (!sh) {
    sh = ss.insertSheet(name);
    sh.appendRow(headers);
    sh.getRange(1, 1, 1, headers.length).setFontWeight("bold");
    sh.setFrozenRows(1);
  }
  return sh;
}
