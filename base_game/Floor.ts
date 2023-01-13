import { Persona } from './Persona';
import actionP from './Persona';
import getPersona from './randomHyrule';

export interface Floor {
  id : number,
  name : string,
  monster : Persona
}

let idFloor = 0;
const fRet : Floor[] = [];

function createFloor() {
  for (let i = 0; i < 9; i += 1) {
    const floor : Floor = {
      id: i + 1,
      name: `Floor ${i + 1}`,
      monster: actionP.setPersona('../jsonFile/enemies.json'),
    };
    floor.monster.hpmax = floor.monster.hp;
    fRet.push(floor);
  }
  const tmp : Floor = {
    id: 10,
    name: 'Floor 10',
    monster: actionP.setPersona('../jsonFile/bosses.json'),
  };
  tmp.monster.hpmax = tmp.monster.hp;
  fRet.push(tmp);
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
