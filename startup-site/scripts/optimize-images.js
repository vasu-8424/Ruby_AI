import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const inputDir = path.resolve('./public/images');
const outputDir = path.resolve('./public/images');

fs.readdir(inputDir, (err, files) => {
    if (err) {
        console.error('Error reading directory:', err);
        return;
    }

    files.forEach(file => {
        if (file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg')) {
            const ext = path.extname(file);
            const baseName = path.basename(file, ext);
            const inputPath = path.join(inputDir, file);
            const outputPath = path.join(outputDir, `${baseName}.webp`);

            sharp(inputPath)
                .webp({ quality: 80 })
                .toFile(outputPath)
                .then(info => {
                    console.log(`Optimized: ${file} -> ${baseName}.webp (${(info.size / 1024).toFixed(2)} KB)`);
                })
                .catch(err => {
                    console.error(`Error processing ${file}:`, err);
                });
        }
    });
});
