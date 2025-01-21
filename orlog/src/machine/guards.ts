import { GameGuard } from "../types.ts";

export const canSetUpGuard: GameGuard<"setUpGame"> = (context, event) => {
  //Check if user can add player to game based on playerlist and ID
  return context.players.length < 2 && context.players.find(p => p.id === event.playerId) === undefined
}

export const canStartGuard: GameGuard<"start"> = (context) => {
  //Check if user can start the game
  return context.players.length === 2
}

export const canThrowGuard: GameGuard<"throwDices"> = (context, event) => {
  //Check if user can throw dices based on current thrower and result
  const player = context.players.find(p => p.id === event.playerId)!
  return context.curentThrower === event.playerId && player.count < 3 && player.result.length < 6
}

export const canSelectGuard: GameGuard<"selectDices"> = (context, event) => {
  //Check if user can select dices to his deck based on current result 
  const player = context.players.find(p => p.id === event.playerId)!
  return context.curentThrower === event.playerId && player.result.length < 6
}
export const canSelectDiceGuard: GameGuard<"chooseDice"> = (context, event) => {
  //Check if user can choose dices based on his turn
  return context.curentThrower === event.playerId
}

export const canChooseGuard: GameGuard<"chooseFavor"> = (context, event) => {
  //Check if user can choose a favor based on result
  const player = context.players.find(p => p.id === event.playerId)!
  return !player.isReady && player.result.length === 6
}
export const canSelectFavorGuard: GameGuard<"selectFavor"> = (context, event) => {
  //Check if user can select favor
  const player = context.players.find(p => p.id === event.playerId)!
  return !player.isReady && player.result.length === 6 && event.playerId === player.id
}

export const canToResoluteGuard: GameGuard<"toResolute"> = (context) => {
  //Check if the game is ready to the resolution phase
  return context.players.find(p => p.result.length != 6 && context.players.find(p => !p.isReady)) === undefined
}

export const canFavorOneGuard: GameGuard<"favorOneRes"> = (context) => {
  //Check if user can use his selected favor and if the favor has the correct priority
  return context.players.find(p => p.selectedFavor !== undefined && p.selectedFavor.priority < 5) !== undefined
}

export const canFavorTwoGuard: GameGuard<"favorTwoRes"> = (context) => {
  //Check if user can use his selected favor and if the favor has the correct priority
  return context.players.find(p => p.selectedFavor !== undefined && p.selectedFavor.priority > 5) !== undefined
}

export const canWinGuard: GameGuard<"resolute"> = (context) => {
  //Check if the game is over (one player has 0 pv)
  return context.players.find(p => p.stats.pv.current <= 0) != undefined
}

export const canNextTurnGuard: GameGuard<"resolute"> = (context) => {
  //Check if the game is ready to go next turn
  return context.players.find(p => p.stats.pv.current <= 0) === undefined
}

export const canDropGuard: GameGuard<"dropPlayer"> = (context) => {
  //Check if the player can be dropped
  return context.players.length > 0
}