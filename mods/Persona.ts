import * as rl from 'readline-sync';
import { Floor } from './Floor';
import getRandomRarity from './randomHyrule';
import bc from './basic_characteristics';
import bc2 from './basic_characteristics_2';
import bco from './better_combat_options';

const fs = require('fs');

let bCO : boolean = false;

export interface Persona {
  id : number,
  name : string,
  hp : number,
  mp : number,
  str : number,
  hpmax : number,
  int : number,
  def : number,
  res : number,
  luck: number,
  spd : number,
  rarity :number,
  race : Race,
  class: Class,
  coins: number
  exp: number,
  lvl: number
}

export interface Class {
  id : number,
  name : string,
  strengths : number[],
  weaknesses : number[],
  attack_type : string,
  alignment : string,
  rarity : number
}

export interface Race {
  id : number,
  name : string,
  strength : number[],
  weakness : number[],
  rarity : number
}

function damage(Atakka: Persona, victim: Persona) : number {
  if (bc.getEnable()) { return bc.moddedDamage(Atakka, victim); }
  victim.hp -= Atakka.str;
  return Atakka.str;
}

function heal(healer : Persona) : number {
  let tmp;

  healer.hp += Math.floor((healer.hpmax / 2));
  if (healer.hp > healer.hpmax) {
    tmp = healer.hp - healer.hpmax;
    tmp = Math.floor(healer.hpmax / 2) - tmp;
    healer.hp = healer.hpmax;
    return tmp;
  }
  return Math.floor(healer.hpmax / 2);
}

function resetbCO() {
  bCO = false;
}
function getbCO() : boolean {
  return bCO;
}

function resetbCOE() {
  bCO = false;
}
function getbCOE() : boolean {
  return bCO;
}

function chooseAction(player : Persona, floor : Floor) : string {
  let bOk = true;
  let info = '';
  do {
    bOk = true;
    const options = ['\x1b[31mAttack\x1b[0m', '\x1b[32mHeal\x1b[0m'];
    if (bc.getEnable()) { options.push('\x1b[33mCharacter\x1b[0m'); }
    if (bc2.getEnable()) { options.push('\x1b[34mSpecial Move\x1b[0m'); }
    if (bco.getEnable()) { options.push('\x1b[35mProtect\x1b[0m'); options.push('\x1b[36mEscape\x1b[0m'); }
    const choice = rl.keyInSelect(options, 'Your choice : ');
    if (choice === -1) { return 'stop'; }
    switch (options[choice]) {
      case '\x1b[31mAttack\x1b[0m': info = `${bc.displayHit(player, floor.monster)}`; break;
      case '\x1b[32mHeal\x1b[0m': info = `\x1b[3mYou healed yourself of \x1b[32m${heal(player)}\x1b[37m HP\x1b[0m\n`; break;
      case '\x1b[33mCharacter\x1b[0m': console.log(bc.displayStat(player)); info = chooseAction(player, floor); break;
      case '\x1b[34mSpecial Move\x1b[0m':
        if (!bc2.getUse()) { console.log('\x1b[31mYou already used it on this fight\x1b[0m'); bOk = false; } else { info = bc2.specialMove(player, floor.monster); }
        break;
      case '\x1b[36mEscape\x1b[0m':
        if (!bco.escape(player, floor)) {
          getbCOE();
          info = `\x1b[1m You fail to escape and \x1b[1m${floor.monster.name} hit you\x1b[0m\n`;
          break;
        }
        info = `\x1b[3mYou escape but \x1b[31m${floor.monster.name}\x1b[37m hit you \x1b[0m\n`;
        break;
      case '\x1b[35mProtect\x1b[0m': getbCO(); info = '\x1b[3mYou \x1b[1m\x1b[35mprotect\x1b[0m\x1b[2m your self sucessfully\x1b[0m'; break;
      default: console.log('\n\x1b[31mAction invalid, please choose a good action\x1b[0m\n'); bOk = false; break;
    }
  } while (bOk === false);
  return info;
}

function setClass(id : Class) : Class {
  const classes = JSON.parse(fs.readFileSync('../jsonFile/classes.json'));
  for (let i = 0; i < classes.length; i += 1) {
    if (id === classes[i].id) { return classes[i]; }
  }
  return classes[0];
}

function setRace(id : Race) {
  const races = JSON.parse(fs.readFileSync('../jsonFile/races.json'));
  for (let i = 0; i < races.length; i += 1) {
    if (id === races[i].id) { return races[i]; }
  }
  return races[0];
}

function setPersona(path) : Persona {
  const nbRandom = getRandomRarity();
  const persona : Persona[] = JSON.parse(fs.readFileSync(path));
  const tabRan = [];
  for (let i = 0; i < persona.length; i += 1) {
    if (persona[i].rarity === nbRandom) {
      persona[i].class = setClass(persona[i].class);
      persona[i].race = setRace(persona[i].race);
      persona[i].coins = 0;
      tabRan.push(persona[i]);
    }
  }
  return tabRan[Math.floor(Math.random() * (tabRan.length - 0) + 0)];
}

function loser(player) : boolean {
  if (player.hp <= 0) {
    return false;
  }
  return true;
}

export default {
  damage, heal, chooseAction, loser, setPersona, getbCO, resetbCO, getbCOE, resetbCOE,
};
