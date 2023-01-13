import * as rl from 'readline-sync';

const fs = require('fs');

function getFile() {
  return fs.readFileSync('./modEnable.txt', 'utf-8').split('\n');
}

function displayMod() {
  const file = getFile();
  for (let i = 0; i < file.length; i += 1) {
    console.log(`${i + 1} - ${file[i]}`);
  }
  console.log('\nQ. Quit');
}

function checkDependance(line : number): boolean {
  if (line === 0) { return true; }
  const file = fs.readFileSync('./modEnable.txt', 'utf-8').split('\n');
  const tmp = file[line - 1].split(' ');
  if (tmp[2] === 'enable') { return true; }
  return false;
}
function setEnable(line : number) : boolean {
  const file = getFile();
  const tmp = file[line - 1].split(' ');
  if (tmp[2] === 'enable') {
    tmp[2] = 'disable';
  } else if (checkDependance(parseInt(tmp[3], 10))) { tmp[2] = 'enable'; } else { return false; }
  file[line - 1] = tmp.join(' ');
  if (tmp[2] === 'disable') {
    for (let i = 0; i < file.length; i += 1) {
      const tmp2 = file[i].split(' ');
      if (line === parseInt(tmp2[3], 10) && tmp2[2] === 'enable') {
        tmp2[2] = 'disable';
      }
      file[i] = tmp2.join(' ');
    }
  }
  fs.writeFileSync('./modEnable.txt', file.join('\n'));
  return true;
}
function chooseMod() {
  const bOk = true;
  const sGood = '\n\x1b[32mChange successfully\n\x1b[0m';
  const sBad = '\n\x1b[31mThis mod need at least one other mod to activate\n\x1b[0m';
  do {
    const choice = rl.question('Your choice : ');
    if (choice > 0 && choice <= getFile().length) {
      if (setEnable(parseInt(choice, 10))) { console.log(sGood); } else { console.log(sBad); }
    } else if (choice.toLowerCase() === 'q') { return 0; } else { console.log('\x1b[31mInvalid : retry\x1b[0m\n'); }
    displayMod();
  } while (bOk);
  return 1;
}

function startModManager() {
  displayMod();
  chooseMod();
}

export default {
  displayMod, startModManager, setEnable,
};
