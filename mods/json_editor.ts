import * as rl from 'readline-sync';

const fs = require('fs');

function displayMenuFile() {
  let sRet = '';
  sRet += '--------------------\n';
  sRet += '1 - bosses.json    |\n';
  sRet += '2 - classes.json   |\n';
  sRet += '3 - enemies.json   |\n';
  sRet += '4 - players.json   |\n';
  sRet += '5 - races.json     |\n';
  sRet += '6 - spells.json    |\n';
  sRet += '7 - traps.json     |\n';
  sRet += '--------------------\n';
  console.log(sRet);
}

function chooseFile() : string {
  const bOk = true;
  do {
    switch (rl.question('Your choice : ')) {
      case '1': return 'bosses.json';
      case '2': return 'classes.json';
      case '3': return 'enemies.json';
      case '4': return 'players.json';
      case '5': return 'races.json';
      case '6': return 'spells.json';
      case '7': return 'traps.json';
      default: console.log('\x1b[31m\x1b[31mInvalid choice.\x1b[0m\n'); break;
    }
  } while (bOk);
  return '';
}

function displayFile(path : string) : number {
  const tmp = fs.readFileSync(`../jsonFile/${path}`, 'utf-8').split('\n');
  console.log('');
  for (let i = 0; i < tmp.length; i += 1) {
    console.log(tmp[i]);
  }
  console.log('');
  return tmp.length;
}

function removeLine(length : number, path : string) {
  const tmp = fs.readFileSync(`../jsonFile/${path}`, 'utf-8').split('\n');
  let bOk = false;
  do {
    const choice = rl.question('Which line to remove ? ("q" for quit): ');
    if (choice.toLowerCase() === 'q') { return false; }
    if (parseInt(choice, 10) > length || parseInt(choice, 10) <= 0) { console.log('\n\x1b[31mInvalid choice\x1b[0m\n'); bOk = true; } else if (rl.question(`Are you sure to remove this line ?\n${tmp[tmp.length - 1]}\n [Y/n] : `).toLowerCase() === 'y') {
      if (parseInt(choice, 10) >= tmp.length - 1) {
        tmp.pop();
        const tmp2 = tmp[tmp.length - 1].split(' ');
        tmp2[tmp2.length - 1] = ']';
        tmp[tmp.length - 1] = tmp2.join(' ');
      } else {
        for (let i = choice; i < tmp.length - 1; i += 1) {
          tmp[i] = tmp[i + 1];
        }
        tmp.pop();
      }
    }
  } while (bOk);
  fs.writeFileSync(`../jsonFile/${path}`, tmp.join('\n'));
  return true;
}

function addLine(path : string) {
  const tmp = fs.readFileSync(`../jsonFile/${path}`, 'utf-8').split('\n');
  displayFile(path);
  const line = tmp[1].split(' ');
  for (let i = 3; i < line.length - 3; i += 2) {
    const choice = rl.question(`The value for ${line[i]} (q for quit) \x1b[31m!string need ""!\x1b[0m : `);
    if (choice.toLowerCase() === 'q') { return false; }
    if (i + 1 < line.length - 4) { line[i + 1] = `${choice},`; } else { line[i + 1] = `${choice}`; }
  }
  line[2] = `${tmp.length},`;
  const tmp2 = tmp[tmp.length - 1].split(' ');
  tmp2[tmp2.length - 1] = ',';
  line[line.length - 2] = ']';
  tmp[tmp.length - 1] = tmp2.join(' ');
  tmp.push(line.join(' '));
  fs.writeFileSync(`../jsonFile/${path}`, tmp.join('\n'));
  return true;
}

function modifyLine(length : number, path : string) {
  const tmp = fs.readFileSync(`../jsonFile/${path}`, 'utf-8').split('\n');
  let bOk = false;
  do {
    const choice = rl.question('Which line to modify ? ("q" for quit): ');
    if (choice.toLowerCase() === 'q') { return false; }
    if (choice > length || choice <= 0) { console.log('\n\x1b[31mInvalid choice\x1b[0m\n'); bOk = true; } else {
      const line = tmp[choice].split(' ');
      for (let i = 3; i < line.length - 3; i += 2) {
        const choice2 = rl.question(`The value for ${line[i]} (q for quit)(empty for ancient value): `);
        if (choice2.toLowerCase() === 'q') { return false; }
        if (choice2 !== '') {
          if (i + 1 < line.length - 4) { line[i + 1] = `${choice2},`; } else { line[i + 1] = `${choice2}`; }
        }
      }
      tmp[choice] = line.join(' ');
    }
  } while (bOk);
  fs.writeFileSync(`../jsonFile/${path}`, tmp.join('\n'));
  return true;
}

function chooseModify(length : number, path : string) {
  const bOk = true;
  do {
    const choice = rl.question('\nDid you want to remove/add/modify a rows ? ("q" for quit): ');
    switch (choice.toLowerCase()) {
      case 'remove': removeLine(length, path); break;
      case 'add': addLine(path); break;
      case 'modify': modifyLine(length, path); break;
      case 'q': return;
      default: break;
    }
    displayFile(path);
  } while (bOk);
}

function JsonEditor() {
  displayMenuFile();
  const path = chooseFile();
  chooseModify(displayFile(path), path);
}

export default {
  displayFile, displayMenuFile, chooseFile, JsonEditor,
};
