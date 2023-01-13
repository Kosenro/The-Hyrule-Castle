import actionP, { Persona } from './Persona';
import lvl from './level_and_experience';
import display from './displayBoard';
import actionF, { Floor } from './Floor';
import bgc from './basic_game_customization';
import cc from './character_creation';
import bc from './basic_characteristics';
import bc2 from './basic_characteristics_2';
import rge from './random_game_events';

const difficulty = bgc.start().split(' ');

function startGame(player : Persona) {
  actionF.createFloor(parseInt(difficulty[1], 10), difficulty[0]);
  let bOk = true;
  let floor : Floor;
  let info = '';
  for (let tour = 1; bOk; tour += 1) {
    floor = actionF.getFloor();
    console.log(display.displayBoard(player, tour, floor, info));
    info = '';
    info += actionP.chooseAction(player, floor);
    if (info === 'stop') { console.log('\n\x1b[1mYou quit the game\n\x1b[0m'); return; }
    if (actionF.checkWin()) {
      player.coins += 1;
      floor.monster.hp = 0;
      console.log(display.displayBoard(player, tour, floor, info));
      bgc.displaywin();
      bOk = false;
    } else if (actionF.winFloor()) {
      tour = 0;
      bc2.setUse(true);
      info += `\x1b[3mYou kill the \x1b[31m${floor.monster.name}\x1b[0m\n`;
      if (lvl.getEnable()) {
        info += `\n\x1b[3mYou earn \x1b[33m${lvl.earningXp(player)}\x1b[37m Exp\n\x1b[0m`;
        if (lvl.checkNextLevel(player)) {
          info += `\x1b[3mYou Pass lvl \x1b[36m${player.lvl}\x1b[37m Congratulation !!!\x1b[0m\n`;
          info += lvl.upStat(player);
        }
      }
      if (rge.getEnable() && floor.room.id !== 0) {
        info += rge.startRoom(player, floor.room);
      }
    } else {
      info += `${bc.displayHitMonster(floor.monster, player)}`;
    }
    if (bOk) {
      bOk = actionP.loser(player);
      if (!bOk) {
        player.hp = 0;
        console.log(display.displayBoard(player, tour, floor, info));
        bgc.displaylose();
      }
    }
  }
}

if (difficulty[0] !== '0') { startGame(cc.createCharacter()); }
