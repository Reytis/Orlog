import { createModel } from 'xstate/lib/model.js';
import { GameContext, GameStates, Player } from '../types.ts';
import { canChooseGuard, canFavorOneGuard, canFavorTwoGuard, canNextTurnGuard, canSelectGuard, canSetUpGuard, canStartGuard, canThrowGuard, canToResoluteGuard, canWinGuard } from './guards.ts';
import { chooseFavorAction, favorOneResAction, favorTwoResAction, nextTurnAction, pointResAction, resultResAction, selectDiceAction, setUpAction, startAction, throwDiceAction } from './actions.ts';
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
    chooseFavor: (playerId: Player["id"], selectedFavor: Player['selectedFavor']) => ({playerId, selectedFavor}),
    toResolute: () => ({}),
    pointRes: () => ({}),
    favorOneRes: () => ({}),
    resultRes: () => ({}),
    favorTwoRes: () => ({}),
    resolute: (playerId: Player["id"]) => ({playerId}),
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
          target: GameStates.TURN
        },
        leave: {
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