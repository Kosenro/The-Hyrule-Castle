import * as rl from 'readline-sync';
import actionP, { Persona, Class, Race } from './Persona';

import bgc from './basic_game_customization';

const fs = require('fs');

let bEnable = false;
let pointStat = 150;

function setEnable() {
  bEnable = (fs.readFileSync('./modEnable.txt', 'utf-8').split('\n')[1].split(' ')[2] === 'enable');
}
function getEnable() : boolean {
  setEnable();
  return bEnable;
}

function rmPointStat(nbr : number) { pointStat -= nbr; }
function addPointStat(nbr : number) { pointStat += nbr; }
function getPointStat() { return pointStat; }

function chooseRaceClass(player : Persona, path : string, type : string) {
  let tab;
  if (type === 'class') { const classes : Class[] = JSON.parse(fs.readFileSync(path)); tab = classes; } else { const races : Race[] = JSON.parse(fs.readFileSync(path)); tab = races; }

  for (const item of tab) {
    console.log(`${item.id} - ${item.name}`);
  }
  const bOk = true;
  do {
    const choice = rl.question(`Choose your character's ${type} : `);
    if (choice > 0 && choice <= tab.length && type === 'class') { player.class = tab[choice - 1]; return; }
    if (choice > 0 && choice <= tab.length && type === 'race') { player.race = tab[choice - 1]; return; }
    console.log('Invalid choose, retry');
  } while (bOk);
}

function getPlayerStat(player : Persona, stat: string) : number {
  switch (stat) {
    case 'hp': return player.hp;
    case 'mp': return player.mp;
    case 'str': return player.str;
    case 'def': return player.def;
    case 'int': return player.int;
    case 'res': return player.res;
    case 'luck': return player.luck;
    case 'spd': return player.spd;
    default: break;
  }
  return 0;
}
function modifStat(stat : string, player : Persona) : number {
  let choice = rl.question(`Do you want to add or remove point on ${stat} ? "+" "-" : `);
  switch (choice) {
    case '+':
      choice = rl.question('How many ? : ');
      if (parseInt(choice, 10) > getPointStat()) {
        console.log('\n\x1b[31mYou need more point for this !\x1b[30m\n');
      } else {
        rmPointStat(parseInt(choice, 10));
        return parseInt(choice, 10);
      }
      break;
    case '-':
      choice = rl.question('How many ? : ');
      if (parseInt(choice, 10) > getPlayerStat(player, stat)) {
        console.log(`\n\x1b[31mYou need more point on ${stat} for this !\x1b[30m\n`);
      } else {
        addPointStat(parseInt(choice, 10));
        return (-parseInt(choice, 10));
      }
      break;
    default: console.log('Invalid option'); return 0;
  }
  return 0;
}

function displayStat(player : Persona) {
  console.log(`Point  : ${getPointStat()}\n`);
  console.log(`1 - HealthPoint       (hp): ${player.hp}`);
  console.log(`2 - MagicPoint        (mp): ${player.mp}`);
  console.log(`3 - Strength         (str): ${player.str}`);
  console.log(`4 - Speed            (spd): ${player.spd}`);
  console.log(`5 - Defence          (def): ${player.def}`);
  console.log(`6 - Magic resistance (res): ${player.res}`);
  console.log(`7 - Intelligence     (int): ${player.int}`);
  console.log(`8 - Luck            (luck): ${player.luck}`);
}

function chooseStat(player : Persona) {
  let bOk = true;
  do {
    bOk = true;
    displayStat(player);
    console.log('\nN - Next step');
    const choice = rl.question('Choose your stat to modify : ');
    switch (choice.toLowerCase()) {
      case '1': player.hp += modifStat('hp', player); break;
      case '2': player.mp += modifStat('mp', player); break;
      case '3': player.str += modifStat('str', player); break;
      case '4': player.spd += modifStat('spd', player); break;
      case '5': player.def += modifStat('def', player); break;
      case '6': player.res += modifStat('res', player); break;
      case '7': player.int += modifStat('int', player); break;
      case '8': player.luck += modifStat('luck', player); break;
      case 'N': bOk = false; break;
      default: break;
    }
  } while (bOk);
}

function createCharacter() : Persona {
  if (!getEnable()) {
    const player : Persona = actionP.setPersona('../jsonFile/players.json');
    player.hpmax = player.hp;
    player.exp = 0;
    player.lvl = 1;
    bgc.giveCoin(player, 12);
    return player;
  }

  let bOk = true;
  const player : Persona = {
    name: '',
    hp: 0,
    str: 0,
    int: 0,
    def: 0,
    res: 0,
    spd: 0,
    id: 0,
    mp: 0,
    hpmax: 0,
    luck: 0,
    rarity: 0,
    coins: 0,
    exp: 0,
    lvl: 1,
    class: {
      id: 666,
      name: 'GOAT',
      strengths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
      weaknesses: [],
      attack_type: 'physical',
      alignment: 'evil',
      rarity: 0,
    },
    race: {
      id: 666, name: 'Nem', strength: [12, 13, 15], weakness: [], rarity: 0,
    },
  };
  while (bOk) {
    chooseRaceClass(player, '../jsonFile/classes.json', 'class');
    chooseRaceClass(player, '../jsonFile/races.json', 'race');
    chooseStat(player);
    player.name = rl.question('Choose the name of your character :');
    console.log('\n=======================================');
    console.log(`\nName : ${player.name}`);
    console.log(`Race : ${player.race.name}   , Class : ${player.class.name}`);
    displayStat(player);
    let choice : string;
    do {
      choice = rl.question('Are you sure ? y/n : ');
      if (choice.toLowerCase() === 'y') { bOk = false; }
    } while (choice.toLowerCase() !== 'y' && choice.toLowerCase() !== 'n');
  }
  player.hpmax = player.hp;
  bgc.giveCoin(player, 12);
  return player;
}

export default {
  setEnable, getEnable, createCharacter,
};
