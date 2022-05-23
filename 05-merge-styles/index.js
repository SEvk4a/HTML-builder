const path = require('path');
const { readdir } = require('fs/promises');
const fs = require('fs');

const pathToFolder = path.join(__dirname, 'styles');
const pathToProjectDist = path.join(__dirname, 'project-dist', 'bundle.css');
const writeStream = fs.createWriteStream(pathToProjectDist, 'utf-8');

async function createBundle(sourse) {
  try {
    const files = await readdir(sourse, { withFileTypes: true });
    for (const file of files) {
      const extName = path.extname(path.join(sourse, file.name));
      if (file.isFile() && extName === '.css') {
        const readableStream = fs.createReadStream(path.join(sourse, file.name), 'utf-8');
        readableStream.on('data', (chunk) => {
          writeStream.write(chunk);
        });
      }
    }
  } catch (error) {
    console.log(error.message);
  }
}

createBundle(pathToFolder);
