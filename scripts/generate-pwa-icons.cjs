// One-off generator for PWA icons from the existing flag.svg brand mark.
// Run with: node scripts/generate-pwa-icons.js
const sharp = require('sharp');
const path = require('path');

const SRC = path.join(__dirname, '../public/pieces/flag.svg');
const OUT_DIR = path.join(__dirname, '../public/icons');
const BG = '#FEF1C2';

async function makeIcon(size, outFile, { safeZoneRatio } = {}) {
  const scale = safeZoneRatio ?? 0.82;
  const contentSize = Math.round(size * scale);
  const svgBuffer = await sharp(SRC)
    .resize(contentSize, contentSize, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();

  await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: BG,
    },
  })
    .composite([{ input: svgBuffer, gravity: 'center' }])
    .png()
    .toFile(path.join(OUT_DIR, outFile));

  console.log(`wrote ${outFile}`);
}

async function main() {
  const fs = require('fs');
  fs.mkdirSync(OUT_DIR, { recursive: true });

  await makeIcon(192, 'icon-192.png');
  await makeIcon(512, 'icon-512.png');
  // maskable needs extra safe-zone padding so OS masks don't crop content
  await makeIcon(512, 'icon-maskable-512.png', { safeZoneRatio: 0.6 });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
