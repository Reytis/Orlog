import { createModel } from 'xstate/lib/model.js'; 
import { GameContext, GameStates, Player } from '../types.ts'; 
import { canChooseGuard, canDropGuard, canFavorOneGuard, canFavorTwoGuard, canNextTurnGuard, canSelectDiceGuard, canSelectFavorGuard, canSelectGuard, canSetUpGuard, canStartGuard, canThrowGuard, canToResoluteGuard, canWinGuard } from './guards.ts'; 
import { chooseDiceAction, chooseFavorAction, dropPlayerAction, favorOneResAction, favorTwoResAction, leaveAction, nextTurnAction, pointResAction, restartAction, resultResAction, selectDiceAction, selectFavorAction, setUpAction, startAction, throwDiceAction } from './actions.ts'; 
import { InterpreterFrom, interpret } from 'xstate';

// Define a model for the game state, with context and events
export const GameModel = createModel({
  players: [] as Player[], // Array of players in the game
  curentThrower: null as null | Player['id'], // The player currently throwing dice
  mainPlayer: null as null | Player['id'], // The main player, e.g., the current turn player
},{
  events: {
    // Game start event
    start: () => ({}), 
    
    // Event to set up the game with player information
    setUpGame: (playerId: Player["id"], playerName: Player["name"], playerCharacter: Player["character"], playerFavor: Player["favor"], playerIsReady: Player["isReady"], playerCount: Player["count"], playerResult: Player["result"], playerStat: Player["stats"], playerDice: Player['dices']) => 
    ({ playerId, playerName, playerCharacter, playerFavor, playerIsReady, playerCount, playerResult, playerStat, playerDice }),
    dropPlayer: (playerId: Player["id"]) => ({playerId}),

    // Player action events (e.g., throwing dice, selecting, etc.)
    throwDices: (playerId: Player["id"]) => ({ playerId }),
    selectDices: (playerId: Player["id"]) => ({ playerId }),
    chooseDice: (playerId: Player["id"], dice: number) => ({ playerId, dice }),
    chooseFavor: (playerId: Player["id"], selectedFavor: Player['selectedFavor']) => ({ playerId, selectedFavor }),
    selectFavor: (playerId: Player["id"], selectedFavor: number, level: number, sacrifice?: number) => ({ playerId, selectedFavor, level, sacrifice }),

    // Game flow events
    toResolute: () => ({}),
    pointRes: () => ({}),
    favorOneRes: () => ({}),
    resultRes: () => ({}),
    favorTwoRes: () => ({}),
    resolute: () => ({}),
    restart: () => ({}),
    leave: () => ({}),
  }
});

// Define the state machine for game flow
export const GameMachine = GameModel.createMachine({
  id: "Orlog", // ID for the machine
  context: GameModel.initialContext, // Initial context
  initial: GameStates.LOBBY, // Initial state is the lobby
  states: {
    // Lobby state where the game setup happens
    [GameStates.LOBBY]: {
      on: {
        start: {
          cond: canStartGuard, // Condition to check if the game can start
          actions: [GameModel.assign(startAction)], // Action when the game starts
          target: GameStates.TURN // Move to the turn state
        },
        setUpGame: {
          cond: canSetUpGuard, // Condition for setting up the game
          actions: [GameModel.assign(setUpAction)], // Action to set up the game
          target: GameStates.LOBBY // Remain in the lobby
        },
        dropPlayer: {
          cond: canDropGuard, // Condition for drop player off the game
          actions: [GameModel.assign(dropPlayerAction)], // Action drop player off the game
          target: GameStates.LOBBY // Remain in the lobby
        }
      }
    },
    // Turn state where players throw dice and select actions
    [GameStates.TURN]: {
      on: {
        throwDices: {
          cond: canThrowGuard, // Condition for throwing dice
          actions: [GameModel.assign(throwDiceAction)], // Action to throw dice
          target: GameStates.TURN // Remain in the turn state
        },
        selectDices: {
          cond: canSelectGuard, // Condition for selecting dice
          actions: [GameModel.assign(selectDiceAction)], // Action to select dice
          target: GameStates.TURN
        },
        chooseDice: {
          cond: canSelectDiceGuard, // Condition for choosing dice
          actions: [GameModel.assign(chooseDiceAction)], // Action for choosing dice
          target: GameStates.TURN
        },
        selectFavor: {
          cond: canSelectFavorGuard, // Condition for selecting favor
          actions: [GameModel.assign(selectFavorAction)], // Action to select favor
          target: GameStates.TURN
        },
        chooseFavor: {
          cond: canChooseGuard, // Condition for choosing favor
          actions: [GameModel.assign(chooseFavorAction)], // Action for choosing favor
          target: GameStates.TURN
        },
        toResolute: {
          cond: canToResoluteGuard, // Condition to move to the resolution state
          target: GameStates.RESOLUTION
        }
      }
    },
    // Resolution state where the results are calculated
    [GameStates.RESOLUTION]: {
      on: {
        pointRes: {
          actions: [GameModel.assign(pointResAction)], // Action for point resolution
          target: GameStates.RESOLUTION
        },
        favorOneRes: {
          cond: canFavorOneGuard, // Condition for resolving favor one
          actions: [GameModel.assign(favorOneResAction)], // Action for favor one resolution
          target: GameStates.RESOLUTION
        },
        resultRes: {
          actions: [GameModel.assign(resultResAction)], // Action for result resolution
          target: GameStates.RESOLUTION
        },
        favorTwoRes: {
          cond: canFavorTwoGuard, // Condition for resolving favor two
          actions: [GameModel.assign(favorTwoResAction)], // Action for favor two resolution
          target: GameStates.RESOLUTION
        },
        resolute: [{
          cond: canWinGuard, // Condition to check if a player has won
          target: GameStates.VICTORY // Move to victory state if a player has won
        }, {
          cond: canNextTurnGuard, // Condition to check if the game can proceed to the next turn
          actions: [GameModel.assign(nextTurnAction)], // Action to proceed to the next turn
          target: GameStates.TURN // Go back to the turn state
        }]
      }
    },
    // Victory state when a player wins
    [GameStates.VICTORY]: {
      on: {
        restart: {
          actions: [GameModel.assign(restartAction)], // Action to restart the game
          target: GameStates.TURN
        },
        leave: {
          actions: [GameModel.assign(leaveAction)], // Action to leave the game
          target: GameStates.LOBBY // Return to the lobby
        }
      }
    }
  }
});

// Function to create and start the game machine
export function makeGame(state: GameStates = GameStates.LOBBY, context: Partial<GameContext> = {}): InterpreterFrom<typeof GameMachine> {
  const machine = interpret(GameMachine.withContext({
    ...GameModel.initialContext, // Use the initial context of the game
    ...context // Merge with any passed-in context
  })).start() // Start the state machine
  machine.state.value = state // Set the initial state
  return machine // Return the running state machine
}
