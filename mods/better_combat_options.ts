import { Floor } from './Floor';
import actP, { Persona } from './Persona';

const fs = require('fs');

let bEnable = false;

function setEnable() {
  bEnable = (fs.readFileSync('./modEnable.txt', 'utf-8').split('\n')[5].split(' ')[2] === 'enable');
}

function getEnable() : boolean {
  setEnable();
  return bEnable;
}

function escape(player : Persona, floor : Floor) : boolean {
  if (floor.id % 10 === 0) { actP.damage(floor.monster, player); return false; }
  player.hp = Math.floor(player.hp * 0.6);
  floor.monster = actP.setPersona('../jsonFile/enemies.json');
  floor.monster.hpmax = floor.monster.hp;

  return true;
}

function protect(monster, player) {
  return (actP.damage(monster, player) / 2);
}

export default {
  protect, escape, getEnable,
};
