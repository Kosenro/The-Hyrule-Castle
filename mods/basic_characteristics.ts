import { Persona } from "./Persona";
import actionP from "./Persona";
import lvl from "./level_and_experience"
import bc2 from "./basic_characteristics_2";
import bco from "./better_combat_options";
const fs = require('fs');

let bEnable = false;

function moddedDamage (Atakka: Persona, victim: Persona)
{
    let mult = 0;
    let divi = 0;
    for (let i = 0; i < Atakka.race.strength.length; i += 1 ){
        if (Atakka.race.strength[i] === victim.race.id){
        mult += 2
        break;
        }
    }
    for (let i = 0; i < Atakka.class.strengths.length; i += 1 ){
        if (Atakka.class.strengths[i] === victim.class.id){
        mult += 2
        break;
        }
    }
    for (let i = 0; i < Atakka.race.weakness.length; i += 1 ){
        if (Atakka.race.weakness[i] === victim.race.id){
        divi += 2
        break;
        }
    }
    for (let i = 0; i < Atakka.class.weaknesses.length; i += 1 ){
        if (Atakka.class.weaknesses[i] === victim.class.id){
        divi += 2
        break;
        }
    }
    if (mult === 0 && divi === 0)
    {
        victim.hp -= Atakka.str
        return Math.floor(Atakka.str)
    }
    else if (mult !== 0 && divi === 0) {
       victim.hp -=Math.floor(Atakka.str * mult)
        return Math.floor(Atakka.str * mult)
    }
    else if (divi !== 0 && mult === 0){
       victim.hp -=Math.floor(Atakka.str / divi)
        return Math.floor(Atakka.str / divi)
    }
    else {
        victim.hp -= Math.floor((Atakka.str * mult) / divi)
        return Math.floor((Atakka.str * mult) / divi)
    }
}


function displayHit(player: Persona, monster : Persona)
{
    const damHit = actionP.damage(player, monster)
    if (damHit< player.str)
      {
        return(`\x1b[1mGlancing hit !\x1b[0m \x1b[3mYou give \x1b[1m${damHit}\x1b[0m\x1b[3m damage to \x1b[31m${monster.name}\x1b[0m\n`);
      }
      else if (damHit> player.str)
      {
        return(`\x1b[1mCrushing hit !\x1b[0m \x1b[3mYou give \x1b[1m${damHit}!\x1b[0m\x1b[3m damage to \x1b[31m${monster.name}\x1b[0m\n`);
      }
      else {
        return(`\x1b[3mYou give \x1b[1m${damHit}\x1b[0m\x1b[3m damage to \x1b[31m${monster.name}\x1b[0m\n`);
      }
}

function displayHitMonster(monster: Persona, player : Persona){
  let damMonster = actionP.damage(monster, player)
  if (bco.getEnable){
      if (actionP.getbCO()){
        actionP.resetbCO();
        damMonster=bco.protect(monster, player)
      }
      if(actionP.getbCOE()){
          actionP.resetbCOE();
          damMonster = actionP.damage(monster, player)
    }
    if (damMonster< monster.str)
      {
        return(`\x1b[1mGlancing hit !\x1b[0m \x1b[3mYou take \x1b[1m${damMonster}\x1b[0m\x1b[2m damage by \x1b[31m${monster.name}\x1b[0m\n`);
      }
      else if (damMonster> monster.str)
      {
        return(`\x1b[1mCrushing hit !\x1b[0m \x1b[3mYou take \x1b[1m${damMonster}!\x1b[0m\x1b[2m damage by \x1b[31m${monster.name}\x1b[0m\n`)
      }
      else {
        return(`\x1b[3mYou take \x1b[1m${damMonster}\x1b[0m\x1b[2m damage by \x1b[31m${monster.name}\x1b[0m\n`)
      }
}
function displayStat(player : Persona){
    if (bc2.getEnable() && lvl.getEnable()){
      return`\nName: ${player.name}\nHP: ${player.hp}   MP: ${player.mp}   Strength: ${player.str}   Exp: ${player.exp}   Level: ${player.lvl}\nIntelligence: ${player.int}   Defense: ${player.def}   Resistance: ${player.res}   Speed: ${player.spd}\nLuck: ${player.luck}   Alignment: ${player.class.alignment} Race: ${player.race.name}   Classe: ${player.class.name}`
    }
    if (bc2.getEnable()){
    return`\nName: ${player.name}\nHP: ${player.hp}   MP: ${player.mp}   Strength: ${player.str}   Intelligence: ${player.int}\nDefense: ${player.def}   Resistance: ${player.res}   Speed: ${player.spd}   Luck: ${player.luck}\nAlignment: ${player.class.alignment} Race: ${player.race.name}   Classe: ${player.class.name}`
    }
    else if (lvl.getEnable()){
      return`\nName: ${player.name}\nHP: ${player.hp}   MP: ${player.mp}   Strength: ${player.str}   Exp: ${player.exp}   Level: ${player.lvl}\nIntelligence: ${player.int}   Defense: ${player.def}   Resistance: ${player.res}   Speed: ${player.spd}\nLuck: ${player.luck}   Race: ${player.race.name}   Classe: ${player.class.name}`
    }
    return`\nName: ${player.name}\nHP: ${player.hp}   MP: ${player.mp}   Strength: ${player.str}   Intelligence: ${player.int}\nDefense: ${player.def}   Resistance: ${player.res}   Speed: ${player.spd}   Luck: ${player.luck}\nRace: ${player.race.name}   Classe: ${player.class.name}`
}
function setEnable(){
    bEnable = (fs.readFileSync('./modEnable.txt', 'utf-8').split('\n')[0].split(' ')[2] === 'enable')
}
function getEnable() : boolean{
    setEnable();
    return bEnable;
}
export default {moddedDamage, displayStat, displayHit, displayHitMonster, setEnable, getEnable}