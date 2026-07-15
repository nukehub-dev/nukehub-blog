import sharp from "sharp";
import { glob } from "glob";
import fs from "fs/promises";
import path from "path";

// Generated icons (`npm run generate:icons`) and the brand logo ship
// optimized and lossless — never re-quantize them with this lossy pass.
const EXCLUDED = [
  "public/icon-*.png",
  "public/apple-touch-icon.png",
  "public/assets/images/nukehub.png",
];

async function optimize() {
  const images = await glob("{public,src/content/posts}/**/*.{png,jpg,jpeg}", {
    ignore: EXCLUDED,
  });
  console.log(`Found ${images.length} images to optimize...`);

  for (const imgPath of images) {
    try {
      const ext = path.extname(imgPath).toLowerCase();
      const pipeline =
        ext === ".png"
          ? sharp(imgPath).png({ quality: 80, palette: true, dither: 0 })
          : sharp(imgPath).jpeg({ quality: 80, mozjpeg: true });
      const buffer = await pipeline.toBuffer();

      const oldSize = (await fs.stat(imgPath)).size;
      if (buffer.length >= oldSize) {
        console.log(
          `Skipped ${imgPath}: already optimal (${Math.round(oldSize / 1024)}KB)`,
        );
        continue;
      }

      await fs.writeFile(imgPath, buffer);
      const newSize = buffer.length;
      const savings = (((oldSize - newSize) / oldSize) * 100).toFixed(2);
      console.log(
        `Optimized ${imgPath}: ${Math.round(oldSize / 1024)}KB -> ${Math.round(newSize / 1024)}KB (${savings}% saved)`,
      );
    } catch (err) {
      console.error(`Error optimizing ${imgPath}:`, err);
    }
  }
  console.log("Optimization complete!");
}

optimize();
