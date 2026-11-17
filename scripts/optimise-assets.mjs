// Optimises the original WordPress uploads into web-ready assets.
// Source of record: source-assets/wp-content/uploads/2018/04/ (copied verbatim from the export).
// Run with: npm run assets
import sharp from "sharp";
import { mkdir, writeFile, copyFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const src = (f) => path.join(root, "source-assets/wp-content/uploads/2018/04", f);
const pub = (f) => path.join(root, "public", f);
const app = (f) => path.join(root, "src/app", f);

await mkdir(pub("images/marks"), { recursive: true });

// Hero: original red-brick property photo, 1920x1080.
await sharp(src("house-1723353_1920-1.jpg"))
  .rotate()
  .resize({ width: 1920, withoutEnlargement: true })
  .jpeg({ quality: 78, mozjpeg: true, progressive: true })
  .toFile(pub("images/red-brick-property.jpg"));

// History/About: original apartment building photo, 3264x2448 -> 2400 wide.
await sharp(src("UEV-IMG_9987-min.jpg"))
  .rotate()
  .resize({ width: 2400, withoutEnlargement: true })
  .jpeg({ quality: 76, mozjpeg: true, progressive: true })
  .toFile(pub("images/apartment-building.jpg"));

// Service diamond marks (copied losslessly; already tiny PNGs).
for (const [from, to] of [
  ["biv.png", "biv.png"],
  ["whs.png", "whs.png"],
  ["m-sfp.png", "sfp.png"],
  ["ar.png", "asb.png"],
  ["biv-icon.png", "brand.png"],
]) {
  await copyFile(src(from), pub(`images/marks/${to}`));
}

// Open Graph / Twitter card image from the original hero photo (1200x630).
await sharp(src("house-1723353_1920-1.jpg"))
  .resize(1200, 630, { fit: "cover", position: "centre" })
  .jpeg({ quality: 80, mozjpeg: true })
  .toFile(pub("images/og-sinking-fund.jpg"));

// Favicons from the existing multicolour mark (88x100), padded to square.
const square = (size, background) =>
  sharp(src("biv-icon.png"))
    .resize(Math.round(size * 0.86), Math.round(size * 0.86), { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .extend({
      top: Math.floor((size - Math.round(size * 0.86)) / 2),
      bottom: Math.ceil((size - Math.round(size * 0.86)) / 2),
      left: Math.floor((size - Math.round(size * 0.86)) / 2),
      right: Math.ceil((size - Math.round(size * 0.86)) / 2),
      background,
    })
    .png();

await square(192, { r: 0, g: 0, b: 0, alpha: 0 }).toFile(app("icon.png"));
await square(180, { r: 255, g: 255, b: 255, alpha: 1 }).flatten({ background: "#ffffff" }).toFile(app("apple-icon.png"));

// favicon.ico containing a single 32x32 PNG image.
const png32 = await square(32, { r: 0, g: 0, b: 0, alpha: 0 }).toBuffer();
const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(1, 4);
const entry = Buffer.alloc(16);
entry.writeUInt8(32, 0);
entry.writeUInt8(32, 1);
entry.writeUInt8(0, 2);
entry.writeUInt8(0, 3);
entry.writeUInt16LE(1, 4);
entry.writeUInt16LE(32, 6);
entry.writeUInt32LE(png32.length, 8);
entry.writeUInt32LE(22, 12);
await writeFile(app("favicon.ico"), Buffer.concat([header, entry, png32]));

console.log("Assets optimised.");
