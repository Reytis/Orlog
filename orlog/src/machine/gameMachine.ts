import { createModel } from 'xstate/lib/model.js';
import { GameContext, GameStates, Player } from '../types.ts';
import { canChooseGuard, canFavorOneGuard, canFavorTwoGuard, canNextTurnGuard, canSelectDiceGuard, canSelectFavorGuard, canSelectGuard, canSetUpGuard, canStartGuard, canThrowGuard, canToResoluteGuard, canWinGuard } from './guards.ts';
import { chooseDiceAction, chooseFavorAction, favorOneResAction, favorTwoResAction, leaveAction, nextTurnAction, pointResAction, restartAction, resultResAction, selectDiceAction, selectFavorAction, setUpAction, startAction, throwDiceAction } from './actions.ts';
import { InterpreterFrom, interpret } from 'xstate';

export const GameModel = createModel({
  players: [] as Player[],
  curentThrower: null as null | Player['id'],
  mainPlayer: null as null | Player['id'],
},{
  events: {
    start: () => ({}),
    setUpGame: (playerId: Player["id"], playerName: Player["name"], playerCharacter: Player["character"], playerFavor: Player["favor"], playerIsReady: Player["isReady"], playerCount: Player["count"], playerResult: Player["result"], playerStat: Player["stats"], playerDice: Player['dices']) => ({playerId, playerName, playerCharacter, playerFavor, playerIsReady, playerCount, playerResult, playerStat, playerDice}),
    throwDices: (playerId: Player["id"]) => ({playerId}),
    selectDices: (playerId: Player["id"]) => ({playerId}),
    chooseDice: (playerId: Player["id"], dice:number) => ({playerId, dice}),
    chooseFavor: (playerId: Player["id"], selectedFavor: Player['selectedFavor']) => ({playerId, selectedFavor}),
    selectFavor: (playerId: Player["id"], selectedFavor: number, level:number, sacrifice?: number) => ({playerId, selectedFavor, level, sacrifice}),
    toResolute: () => ({}),
    pointRes: () => ({}),
    favorOneRes: () => ({}),
    resultRes: () => ({}),
    favorTwoRes: () => ({}),
    resolute: () => ({}),
    restart: () => ({}),
    leave: () => ({})
  }
})

export const GameMachine = GameModel.createMachine({
  id:"Orlog",
  context: GameModel.initialContext,
  initial: GameStates.LOBBY,
  states:{
    [GameStates.LOBBY]: {
      on: {
        start: {
          cond: canStartGuard,
          actions: [GameModel.assign(startAction)],
          target: GameStates.TURN
        },
        setUpGame: {
          cond: canSetUpGuard,
          actions: [GameModel.assign(setUpAction)],
          target: GameStates.LOBBY
        }
      }
    },
    [GameStates.TURN]: {
      on: {
        throwDices: {
          cond: canThrowGuard,
          actions: [GameModel.assign(throwDiceAction)],
          target: GameStates.TURN
        },
        selectDices: {
          cond: canSelectGuard,
          actions: [GameModel.assign(selectDiceAction)],
          target: GameStates.TURN
        },
        chooseDice: {
          cond: canSelectDiceGuard,
          actions: [GameModel.assign(chooseDiceAction)],
          target: GameStates.TURN
        },
        selectFavor: {
          cond: canSelectFavorGuard,
          actions: [GameModel.assign(selectFavorAction)],
          target: GameStates.TURN
        },
        chooseFavor: {
          cond: canChooseGuard,
          actions: [GameModel.assign(chooseFavorAction)],
          target: GameStates.TURN
        },
        toResolute: {
          cond: canToResoluteGuard,
          target: GameStates.RESOLUTION
        }
      }
    },
    [GameStates.RESOLUTION]: {
      on: {
        pointRes: {
          actions: [GameModel.assign(pointResAction)],
          target: GameStates.RESOLUTION
        },
        favorOneRes: {
          cond: canFavorOneGuard,
          actions: [GameModel.assign(favorOneResAction)],
          target: GameStates.RESOLUTION
        },
        resultRes: {
          actions: [GameModel.assign(resultResAction)],
          target: GameStates.RESOLUTION
        },
        favorTwoRes: {
          cond: canFavorTwoGuard,
          actions: [GameModel.assign(favorTwoResAction)],
          target: GameStates.RESOLUTION
        },
        resolute: [{
          cond: canWinGuard,
          target: GameStates.VICTORY
        },{
          cond: canNextTurnGuard,
          actions: [GameModel.assign(nextTurnAction)],
          target: GameStates.TURN
        }]
      }
    },
    [GameStates.VICTORY]: {
      on: {
        restart: {
          actions: [GameModel.assign(restartAction)],
          target: GameStates.TURN
        },
        leave: {
          actions: [GameModel.assign(leaveAction)],
          target: GameStates.LOBBY
        }
      }
    }
  }
})

export function makeGame (state: GameStates = GameStates.LOBBY, context: Partial<GameContext> = {}): InterpreterFrom<typeof GameMachine> {
  const machine = interpret(GameMachine.withContext({
    ...GameModel.initialContext,
    ...context
  })).start()
  machine.state.value = state
  return machine
}