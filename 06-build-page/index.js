const { mkdir, readdir, copyFile, rm, readFile } = require('fs/promises');
const path = require('path');
const fs = require('fs');

const pathToProjectDist = path.join(__dirname, 'project-dist');

async function mainFunction() {
  try {
    await rm(pathToProjectDist, { recursive: true, force: true });
    await mkdir(pathToProjectDist, { recursive: true });
    await copyAssets(path.join(__dirname, 'assets'), path.join(pathToProjectDist, 'assets'));
    await mergeStyles(path.join(__dirname, 'styles'));
    await makeHtml();
  } catch (error) {
    console.log(error.message);
  }
}

// COPY ASSETS FOLDER TO PROJECT DIST
const copyAssets = async (pathToAssets, pathToProjectAssets) => {
  await rm(pathToProjectAssets, { recursive: true, force: true });
  await mkdir(pathToProjectAssets, { recursive: true });
  const files = await readdir(pathToAssets, { withFileTypes: true });
  for (const file of files) {
    if (file.isFile()) {
      await copyFile(path.join(pathToAssets, file.name), path.join(pathToProjectAssets, file.name));
    } else {
      await copyAssets(
        path.join(pathToAssets, file.name),
        path.join(pathToProjectAssets, file.name),
      );
    }
  }
};

// MERGE STYLES TO PROJECT DIST STYLE.CSS
const mergeStyles = async (pathToStyles) => {
  const pathToProjectStylesFile = path.join(pathToProjectDist, 'style.css');
  const writeStream = fs.createWriteStream(pathToProjectStylesFile, 'utf-8');
  try {
    const files = await readdir(pathToStyles, { withFileTypes: true });
    for (const file of files) {
      const extName = path.extname(path.join(pathToStyles, file.name));
      if (file.isFile() && extName === '.css') {
        const readableStream = fs.createReadStream(path.join(pathToStyles, file.name), 'utf-8');
        readableStream.on('data', (chunk) => {
          writeStream.write(chunk);
        });
      }
    }
  } catch (error) {
    console.log(error.message);
  }
};

// CREATE OBJECT WITH HTML
const handleHtmlData = async () => {
  const htmlData = {};
  const pathToComponents = path.join(__dirname, 'components');
  const files = await readdir(pathToComponents, { withFileTypes: true });
  for (const file of files) {
    const filePath = path.join(pathToComponents, file.name);
    if (file.isFile() && path.extname(filePath) === '.html') {
      const data = await readFile(filePath);
      htmlData[file.name] = data.toString();
    }
  }
  return htmlData;
};

// CREATE INDEX FILE
async function makeHtml() {
  const htmlData = await handleHtmlData();
  const writeStream = fs.createWriteStream(path.join(pathToProjectDist, 'index.html'));

  fs.readFile(path.join(__dirname, 'template.html'), 'utf-8', (err, data) => {
    if (err) console.log(err.message);
    let result = data;
    for (const comp of Object.keys(htmlData)) {
      result = result.replace(`{{${comp.split('.')[0]}}}`, htmlData[comp]);
    }
    writeStream.write(result);
  });
}

mainFunction();

// node 06-build-page
