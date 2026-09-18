import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { deflateSync } from "node:zlib";

const PAPER = [243, 238, 230, 255];
const INK = [12, 11, 10, 255];

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc ^= buf[i];
    for (let j = 0; j < 8; j++) crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const typeBuf = Buffer.from(type);
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])));
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

function encodePng(width, height, pixels) {
  const raw = Buffer.alloc((width * 4 + 1) * height);
  for (let y = 0; y < height; y++) {
    const row = y * (width * 4 + 1);
    raw[row] = 0;
    pixels.copy(raw, row + 1, y * width * 4, (y + 1) * width * 4);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

function setPixel(pixels, size, x, y, color) {
  if (x < 0 || y < 0 || x >= size || y >= size) return;
  const i = (y * size + x) * 4;
  pixels[i] = color[0];
  pixels[i + 1] = color[1];
  pixels[i + 2] = color[2];
  pixels[i + 3] = color[3];
}

function drawDisc(pixels, size, cx, cy, r, color) {
  const r2 = r * r;
  const minX = Math.max(0, Math.floor(cx - r));
  const maxX = Math.min(size - 1, Math.ceil(cx + r));
  const minY = Math.max(0, Math.floor(cy - r));
  const maxY = Math.min(size - 1, Math.ceil(cy + r));
  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      const dx = x - cx;
      const dy = y - cy;
      if (dx * dx + dy * dy <= r2) setPixel(pixels, size, x, y, color);
    }
  }
}

function drawLine(pixels, size, x0, y0, x1, y1, thickness, color) {
  const dx = x1 - x0;
  const dy = y1 - y0;
  const steps = Math.max(Math.abs(dx), Math.abs(dy), 1);
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    drawDisc(pixels, size, x0 + dx * t, y0 + dy * t, thickness / 2, color);
  }
}

function makeIcon(size, insetRatio) {
  const pixels = Buffer.alloc(size * size * 4);
  for (let i = 0; i < size * size; i++) {
    pixels[i * 4] = PAPER[0];
    pixels[i * 4 + 1] = PAPER[1];
    pixels[i * 4 + 2] = PAPER[2];
    pixels[i * 4 + 3] = PAPER[3];
  }
  const inset = size * insetRatio;
  const top = inset + size * 0.14;
  const bottom = size - inset - size * 0.1;
  const left = inset + size * 0.18;
  const right = size - inset - size * 0.18;
  const midX = size / 2;
  const thickness = size * 0.11;
  drawLine(pixels, size, left, top, midX, bottom, thickness, INK);
  drawLine(pixels, size, right, top, midX, bottom, thickness, INK);
  return encodePng(size, size, pixels);
}

const outDir = join(process.cwd(), "public", "icons");
await mkdir(outDir, { recursive: true });

const files = [
  ["icon-192.png", makeIcon(192, 0.08)],
  ["icon-512.png", makeIcon(512, 0.08)],
  ["icon-512-maskable.png", makeIcon(512, 0.22)],
  ["apple-touch-icon.png", makeIcon(180, 0.08)],
];

for (const [name, buf] of files) {
  await writeFile(join(outDir, name), buf);
}

await writeFile(join(process.cwd(), "public", "apple-touch-icon.png"), files[3][1]);
console.log("Wrote PWA icons");
