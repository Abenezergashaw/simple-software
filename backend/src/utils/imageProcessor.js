const crypto = require('crypto');
const fs = require('fs/promises');
const path = require('path');
const sharp = require('sharp');

const uploadDirectory = path.join(__dirname, '../uploads');
const allowedFormats = new Set(['jpeg', 'png', 'webp']);

const processImage = async (file) => {
  if (!file?.buffer) throw Object.assign(new Error('Invalid image upload'), { status: 400 });
  let outputPath;
  try {
    const input = sharp(file.buffer, {
      failOn: 'error',
      limitInputPixels: 40_000_000,
      sequentialRead: true,
    });
    const metadata = await input.metadata();
    if (!allowedFormats.has(metadata.format)) throw new Error('Unsupported image format');

    await fs.mkdir(uploadDirectory, { recursive: true });
    const filename = `${crypto.randomBytes(20).toString('hex')}.webp`;
    outputPath = path.join(uploadDirectory, filename);
    await input
      .rotate()
      .resize({ width: 2000, height: 2000, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 82, effort: 5, smartSubsample: true })
      .toFile(outputPath);
    return { filename, imageUrl: `/uploads/${filename}` };
  } catch (error) {
    if (outputPath) await fs.rm(outputPath, { force: true }).catch(() => {});
    throw Object.assign(new Error('The uploaded file is not a valid JPEG, PNG, or WebP image'), { status: 400 });
  }
};

const processImages = async (files = []) => {
  const processed = [];
  try {
    for (const file of files) processed.push(await processImage(file));
    return processed;
  } catch (error) {
    await Promise.all(processed.map((file) => fs.rm(path.join(uploadDirectory, file.filename), { force: true })));
    throw error;
  }
};

module.exports = { processImage, processImages };
