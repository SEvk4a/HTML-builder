const path = require('path');
const fs = require('fs');
const { readdir } = require('fs/promises');

const pathToFolder = path.join(__dirname, 'secret-folder');

async function filesInfo(pathToFolder) {
  try {
    const files = await readdir(pathToFolder, { withFileTypes: true });
    files.forEach((file) => {
      if (file.isFile()) {
        fs.stat(path.join(pathToFolder, file.name), (error, stat) => {
          if (error) {
            console.log(error.message);
          } else {
            const pathToFile = path.join(pathToFolder, file.name);
            console.log(
              `${path.parse(pathToFile).name} - ${path.extname(pathToFile).slice(1)} - ${
                stat.size / 1000
              }Kb`,
            );
          }
        });
      }
    });
  } catch (error) {
    console.log(error.message);
  }
}

filesInfo(pathToFolder);
