import { Persona } from './Persona';

let bEnable : boolean = false;
let use : boolean = true;

const fs = require('fs');

function getUse() {
  return use;
}

function setUse(b : boolean) {
  use = b;
}

function setEnable() {
  bEnable = (fs.readFileSync('./modEnable.txt', 'utf-8').split('\n')[2].split(' ')[2] === 'enable');
}

function getEnable() : boolean {
  setEnable();
  return bEnable;
}

function specialMove(player : Persona, monster : Persona) {
  if (player.class.alignment === 'good') { player.hp = player.hpmax; setUse(false); return '\x1b[3mYou healed \x1b[1m100%\x1b[0m\x1b[3m of your hp\x1b[0m\n'; }
  monster.hp -= player.str * 4; setUse(false); return `\x1b[3mYou deal \x1b[1m${player.str * 4}\x1b[0m\x1b[3m damage to \x1b[31m${monster.name}\x1b[0m\n`;
}

export default {
  setEnable, getEnable, getUse, setUse, specialMove,
};
