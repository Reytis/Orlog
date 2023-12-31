import { ContextFrom, EventFrom } from "xstate"
import { GameModel } from "./machine/gameMachine.ts"

/*
  GAME TYPES 
*/
export type Favor = {
  level: number | null,
  name: Gods,
  priority: number,
  cost?: number[],
  target?: string,
  sacrifice?: number,
  description?: string,
  selected: boolean
}
export type Dice = {
  pp: boolean,
  face: Face,
  selected: boolean
  banned?: boolean
}
export type Bonus = {
  num: number, 
  type: Face, 
  multiply:boolean
}
export type Player = {
  id: string,
  name: string,
  character?: Character,
  favor?: Favor[],
  dices?: Dice[],
  result: Dice[],
  lockRes?: {
    axe: number,
    helmet: number,
    shield: number,
    arrow: number,
    hand: number
  },
  bannedDices?: Dice[],
  additionalDices?: Dice[],
  spentPP?: number,
  stats: {
    pv: {current: number, update: number},
    pp: {current: number, update: number}
  },
  selectedFavor?: Favor,
  isReady: boolean,
  count: number,
  bonus?: Bonus[]
}
export type PlayerObject = {
  name: string,
  character: Character[],
  favors: string[],
  position: string
}

/*
  GAME DATAS
*/
export enum Face {
  axe = 'axe',
  helmet = 'helmet',
  shield = 'shield',
  bow = 'bow',
  hand = 'hand',
}
export enum Gods {
  thrymr = 'thrymr',//1
  var = 'var',//1
  loki = 'loki',//2
  freyja = 'freyja',//2
  frigg = 'frigg',//2
  tyr = 'tyr',//3  Sacrifice
  skuld = 'skuld',//3
  freyr = 'freyr',//4
  skadi = 'skadi',//4  Bonus
  mimir = 'mimir',//4
  bragi = 'bragi',//4
  vidar = 'vidar',//4  Bonus
  brunhild = 'brunhild',//4  Bonus
  baldr = 'baldr',//4  Bonus
  ullr = 'ullr',//4  Bonus
  heimdall = 'heimdall',//4
  hel = 'hel',//4
  thor = 'thor', //6
  odin = 'odin',//7  Sacrifice
  idunn = 'idunn',//7
  none = 'undefined'//none
}
export enum Character {
  eivorHomme= 'eivor-homme',
  eivorFemme= 'eivor-femme'
}
export enum GameStates {
  LOBBY = 'LOBBY',
  TURN = 'TURN',
  RESOLUTION = 'RESOLUTION',
  VICTORY = 'VICTORY'
}


/*
  GAME MACHINE
*/

export type GameContext = ContextFrom<typeof GameModel>
export type GameEvents = EventFrom<typeof GameModel>
export type GameEvent<T extends GameEvents["type"]> = GameEvents & {type: T}
export type GameGuard<T extends GameEvents["type"]> = (
  context: GameContext,
  event: GameEvent<T>
) => boolean
export type GameAction<T extends GameEvents["type"]> = (
  context: GameContext,
  event: GameEvent<T>
) => Partial<GameContext>