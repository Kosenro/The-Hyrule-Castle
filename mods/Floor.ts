import actionP, { Persona } from './Persona';
import rge, { Room } from './random_game_events';

export interface Floor {
  id : number,
  name : string,
  monster : Persona,
  room : Room
}

let idFloor = 0;
const fRet : Floor[] = [];

function createFloor(nbrFloor : number, difficulty : string) {
  for (let i = 1; i <= nbrFloor; i += 1) {
    const floor : Floor = {
      id: i,
      name: `Floor ${i}`,
      monster: i % 10 === 0 ? actionP.setPersona('../jsonFile/bosses.json') : actionP.setPersona('../jsonFile/enemies.json'),
      room: i % 10 === 0 ? rge.setRoom(100) : rge.setRoom(35),
    };
    floor.monster.hpmax = floor.monster.hp;
    switch (difficulty) {
      case '2': floor.monster.str = Math.floor(floor.monster.str * 1.5); break;
      case '3': floor.monster.str *= 2; break;
      default: break;
    }
    fRet.push(floor);
  }
}

function getFloor() {
  return fRet[idFloor];
}

function nextFloor() {
  idFloor += 1;
  fRet[idFloor].monster.hp = fRet[idFloor].monster.hpmax;
}

function winFloor():boolean {
  if (fRet[idFloor].monster.hp <= 0) {
    nextFloor();
    return true;
  }
  return false;
}

function checkWin() : boolean {
  if (fRet.length === idFloor + 1 && fRet[idFloor].monster.hp <= 0) { return true; }
  return false;
}

export default {
  createFloor, getFloor, nextFloor, winFloor, checkWin,
};
