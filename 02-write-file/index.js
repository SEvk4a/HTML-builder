const fs = require('fs');
const path = require('path');
const { stdin, stdout } = process;

const output = fs.createWriteStream(path.join(__dirname, 'text.txt'));
stdout.write('Write some text\n');
stdin.on('data', (data) => {
  if (data.toString().trim() === 'exit') process.exit();
  output.write(data.toString());
});

process.on('exit', () => stdout.write('Bye'));
process.on('SIGINT', process.exit);
