import sharp from 'sharp';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const svgBuffer = readFileSync(join(__dirname, '../public/iconslogo.png'));

// Generate 192x192
sharp(svgBuffer)
  .resize(192, 192)
  .png()
  .toFile(join(__dirname, '../public/icon-192.png'))
  .then(() => console.log('✅ icon-192.png generated'));

// Generate 512x512
sharp(svgBuffer)
  .resize(512, 512)
  .png()
  .toFile(join(__dirname, '../public/icon-512.png'))
  .then(() => console.log('✅ icon-512.png generated'));