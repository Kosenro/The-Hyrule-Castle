import * as rl from 'readline-sync';
import { Persona } from './Persona';
import getRandomRarity from './randomHyrule';

const fs = require('fs');

let bEnable = false;

export interface Room {
  id: number,
  name: string,
  requirement: string,
  rarity: number
}

function setEnable() {
  bEnable = (fs.readFileSync('./modEnable.txt', 'utf-8').split('\n')[4].split(' ')[2] === 'enable');
}

function getEnable() : boolean {
  setEnable();
  return bEnable;
}

function setRoom(chance : number) : Room {
  const bOk = true;
  const room : Room[] = JSON.parse(fs.readFileSync('../jsonFile/traps.json'));
  if (chance >= (Math.random() * 100 - 1) + 1) {
    do {
      const random = getRandomRarity();
      for (let i = 0; i < room.length; i += 1) {
        if (room[i].rarity === random) { return room[i]; }
      }
    } while (bOk);
  }
  const noroom : Room = {
    id: 0, name: 'noroom', requirement: '', rarity: 0,
  };
  return noroom;
}

function leave(player : Persona, room : Room) : string {
  const tmp = room.requirement.split('_');
  let bPass = true;
  switch (tmp[0]) {
    case 'HP': if (player.hpmax < parseInt(tmp[1], 10)) { bPass = false; } break;
    case 'MP': if (player.mp < parseInt(tmp[1], 10)) { bPass = false; } break;
    case 'STR': if (player.str < parseInt(tmp[1], 10)) { bPass = false; } break;
    case 'SPD': if (player.spd < parseInt(tmp[1], 10)) { bPass = false; } break;
    case 'DEF': if (player.def < parseInt(tmp[1], 10)) { bPass = false; } break;
    case 'RES': if (player.res < parseInt(tmp[1], 10)) { bPass = false; } break;
    case 'INT': if (player.int < parseInt(tmp[1], 10)) { bPass = false; } break;
    case 'LUCK': if (player.luck < parseInt(tmp[1], 10)) { bPass = false; } break;
    default: break;
  }
  if (bPass && room.name !== 'Treasure Room') { player.coins += 1; return 'You pass the room and earn 1 coins'; }
  if (room.name !== 'Treasure Room') { player.hp -= Math.floor(player.hp * 0.15); return 'You don\'t have the requirements, you lose 15% of hp'; }

  const earn = Math.floor((Math.random() * (5 - 3)) + 3);
  player.coins += earn;
  return `You earn ${earn} coin`;
}

function startRoom(player : Persona, room : Room) : string {
  let sRet = '';
  sRet += '\nYou find and enterred in secret room\n';
  sRet += '-----------------------------------------\n';
  sRet += `   ========   \x1b[1m${room.name}\x1b[0m    ========   \n`;
  sRet += '-----------------------------------------\n';
  sRet += ` Requirement : ${room.requirement}\n`;
  sRet += '\n-------Options -----------\n';
  sRet += '1. Leave \n';
  console.log(sRet);
  let bOk = false;
  do {
    switch (rl.question('Your choice : ')) {
      case '1': return leave(player, room);
      default: console.log('Invalid choice'); bOk = true; break;
    }
  } while (bOk);
  return '';
}

export default {
  setRoom, getEnable, startRoom,
};
