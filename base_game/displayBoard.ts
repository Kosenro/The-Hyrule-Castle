import {Persona} from './Persona';
import {Floor} from './Floor';
const emoji = require('node-emoji')

function displayHP(persona : Persona, color : string) {
  let sRet = `\x1b[1m${color}${persona.name}\x1b[0m\n`;
  sRet += 'HP: ';
  for (let i = 0; i < persona.hpmax; i += 1) {
    if (persona.hp > i) { sRet += '\x1b[32m❤\x1b[0m'; } else { sRet += '\x1b[30m❤\x1b[0m'; }
  }
  sRet += ` ${persona.hp} / ${persona.hpmax}\n\n`;
  return sRet;
}

function displayBoard(player : Persona, tour : number, floor : Floor, info : string) {
  let sRet : string = '';
  sRet += `\x1b[1m\x1b[31m=========================== ${floor.name} ============================\x1b[0m\n`;
  sRet += `\x1b[1m\x1b[35m                ===========  Tour ${tour} ===========\x1b[0m\n`;
  sRet += displayHP(floor.monster, '\x1b[31m');
  sRet += displayHP(player, '\x1b[36m');
  sRet += '\n-----Option  ----\n';
  sRet += '1. \x1b[31mAttack\x1b[0m      2. \x1b[32mHeal\x1b[0m\n\n';
  sRet += `${info}`;
  return sRet;
}

export default {
  displayBoard, displayHP,
};
