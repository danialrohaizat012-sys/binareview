# BinaReview — NFC Review Card

## Pakej
| | **Lite** | **Smart** |
|---|---|---|
| Tap kad → Google Review | ✅ terus | ✅ selepas rating 4–5★ |
| Rating 1–3★ → borang maklum balas dalaman | ❌ | ✅ (WhatsApp / Google Sheet) |
| Kumpul nama & no. telefon pelanggan | ❌ | ✅ |
| Pangkalan data pelanggan (Google Sheet) | ❌ | ✅ tab "Pelanggan" + persetujuan promosi |
| Kira bilangan tap (jika ada webhook) | ✅ | ✅ |

Pilih pakej ikut URL: `?plan=lite` atau `?plan=smart` (lalai: smart).

Nota: untuk Lite, anda boleh juga tulis link Google terus ke dalam tag NFC (tanpa laman ini), tapi
guna laman ini membolehkan jenama kedai dipaparkan & tap dikira, dan link boleh ditukar kemudian tanpa tulis semula tag.

## PDPA
Smart mengumpul data peribadi. Notis privasi dipaparkan dan kotak "setuju promosi" **tidak ditanda secara lalai**
(persetujuan mesti diberi sendiri oleh pelanggan). Kedai hanya boleh hantar promosi kepada pelanggan yang tanda "Ya".

Cara ia berfungsi: customer tap kad NFC, laman web terbuka, dan dia pilih bintang.
- **4–5 ★** → terus ke borang ulasan Google (teks contoh disalin secara automatik)
- **1–3 ★** → borang maklum balas dalaman (dihantar ke WhatsApp pemilik atau Google Sheet), dengan pautan kecil "tulis di Google" yang masih ada

## Setup setiap kedai
1. **Place ID**: cari kedai di https://developers.google.com/maps/documentation/places/web-service/place-id
2. Edit `CONFIG` dalam `index.html` ATAU guna satu fail untuk semua kedai melalui URL:
   `https://domain-anda.com/review/?shop=Kopi%20Pak%20Mat&place=ChIJ...&wa=60123456789`

   Parameter tambahan: `logo=URL_LOGO`, `color=%23e11d48` (warna utama), `color2=%23f59e0b` (warna gradient kedua). `%23` ialah `#`.
3. Host di Netlify / Vercel / GitHub Pages (percuma).
4. Tulis URL ke dalam tag NFC (NTAG213/215) guna app **NFC Tools**, kemudian Write → Add record → URL. Kunci (lock) tag selepas siap.
5. Cetak QR code URL yang sama di belakang kad, untuk telefon yang tiada NFC (kebanyakan iPhone lama).

## Simpan data (pilihan)
Ikut langkah dalam `apps-script.gs`, kemudian letak URL webhook dalam `CONFIG.sheetWebhook`.
Bila webhook ada, maklum balas masuk ke Sheet (dan emel jika diset), bukan lagi ke WhatsApp.

## ⚠️ Polisi Google: "review gating"
Google melarang perbuatan menapis customer supaya hanya yang puas hati menulis ulasan.
Kalau dikesan, ulasan boleh dipadam dan profil boleh disekat.
Sebab itu `showGoogleOnLowRating: true` ialah tetapan lalai: customer 1–3 ★ masih nampak pautan ke Google,
cuma laluan utama mereka ialah borang dalaman. Elakkan tukar ke `false`, lebih-lebih lagi untuk kad yang dijual kepada pelanggan.
