const { readdir, copyFile, rm, mkdir } = require('fs/promises');
const path = require('path');

const pathToFolder = path.join(__dirname, 'files');
const pathToCopyFolder = path.join(__dirname, 'files-copy');

async function copyDir(source, target) {
  try {
    await rm(target, { recursive: true, force: true });
    await mkdir(target, { recursive: true });
    const files = await readdir(source, { withFileTypes: true });
    for (const file of files) {
      await copyFile(path.join(source, file.name), path.join(target, file.name));
    }
  } catch (error) {
    console.log(error.message);
  }
}

copyDir(pathToFolder, pathToCopyFolder);
