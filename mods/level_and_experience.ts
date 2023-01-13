import { Persona } from './Persona';

const fs = require('fs');

let bEnable = false;

let needForNext = 50;

function setEnable() {
  bEnable = (fs.readFileSync('./modEnable.txt', 'utf-8').split('\n')[3].split(' ')[2] === 'enable');
}
function getEnable() : boolean {
  setEnable();
  return bEnable;
}

function earningXp(player : Persona) : number {
  const expEarn = Math.floor(Math.random() * (50 - 15)) + 15;
  player.exp += expEarn;
  return expEarn;
}
function checkNextLevel(player : Persona) {
  if (player.exp === needForNext) {
    player.exp = 0;
    needForNext *= 1.25;
    player.lvl += 1;
    return true;
  }
  if (player.exp > needForNext) {
    player.exp -= needForNext;
    needForNext *= 1.25;
    player.lvl += 1;
    return true;
  }
  return false;
}

function upStat(player: Persona) {
  let sStat: string = '';
  for (let i = 1; i <= 3; i += 1) {
    const earnStat = Math.floor(Math.random() * (8 - 1)) + 1;
    switch (earnStat) {
      case 1: player.hpmax += 5; sStat += 'You win 5 HP\n'; break;
      case 2: player.mp += 5; sStat += 'You win 5 magic point\n'; break;
      case 3: player.str += 2; sStat += 'Your strength increase of 2\n'; break;
      case 4: player.spd += 2; sStat += 'Your speed increase of 2\n'; break;
      case 5: player.def += 2; sStat += 'Your defense increase of 2\n'; break;
      case 6: player.res += 2; sStat += 'Your resistance increase of 2\n'; break;
      case 7: player.int += 3; sStat += 'Your intelligence increase of 3\n'; break;
      case 8: player.luck += 5; sStat += 'Your luck increase of 5\n'; break;
      default: break;
    }
  }
  return sStat;
}
export default {
  getEnable, earningXp, checkNextLevel, upStat,
};
