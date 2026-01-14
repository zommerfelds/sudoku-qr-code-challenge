const QRCode = require('qrcode');
const fs = require('fs');

const url = process.argv[2];
if (!url) {
  console.error('Usage: node generate-sheet.js <URL>');
  process.exit(1);
}

const generateQrCodes = async () => {
  const qrCodes = [];
  for (let i = 1; i <= 9; i++) {
    const qrUrl = `${url}?n=${i}`;
    const qrDataUrl = await QRCode.toDataURL(qrUrl, {
      errorCorrectionLevel: 'H',
      width: 512,
      margin: 2,
    });
    qrCodes.push(qrDataUrl);
  }
  return qrCodes;
};

const createHtml = (qrCodes) => {
  const qrCodeImages = qrCodes.map(qr => `<img src="${qr}" alt="QR Code">`).join('');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>QR Code Sheet</title>
  <style>
    body {
      font-family: sans-serif;
    }
    .grid-container {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-gap: 150px;
      max-width: 100%;
    }
    img {
      width: 100%;
      height: auto;
    }
  </style>
</head>
<body>
  <p>Das mittlere Feld hat die Lösung...</p>
  <p>TODO: add Sudoku</p>
  <div class="grid-container">
    ${qrCodeImages}
  </div>
</body>
</html>
  `;
};

generateQrCodes()
  .then(qrCodes => {
    const html = createHtml(qrCodes);
    fs.writeFileSync('sheet.html', html);
    console.log('sheet.html generated successfully.');
  })
  .catch(err => {
    console.error('Error generating QR codes:', err);
  });
