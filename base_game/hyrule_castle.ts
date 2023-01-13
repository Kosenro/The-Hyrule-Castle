import { Persona } from './Persona';
import actionP from './Persona';
import display from './displayBoard';
import { Floor } from './Floor';
import actionF from './Floor';

const player: Persona = actionP.setPersona('../jsonFile/players.json');

player.hpmax = player.hp;

actionF.createFloor();
let bOk = true;
let floor : Floor;
let info = '';
for (let tour = 1; bOk; tour += 1) {
  floor = actionF.getFloor();
  console.log(display.displayBoard(player, tour, floor, info));
  info = '';
  info += actionP.chooseAction(player, floor);
  if (actionF.checkWin()) {
    floor.monster.hp = 0;
    console.log(display.displayBoard(player, tour, floor, info));
    console.log('You win!');
    bOk = false;
  } else if (actionF.winFloor()) {
    tour = 0;
    info += `You kill the ${floor.monster.name}\n`;
  } else {
    actionP.damage(floor.monster, player);
    info += `You take ${floor.monster.str} damage by ${floor.monster.name}\n`;
  }
  if (bOk) {
    bOk = actionP.loser(player);
    if (!bOk) {
      player.hp = 0;
      console.log(display.displayBoard(player, tour, floor, info));
      console.log('You lose');
    }
  }
}
