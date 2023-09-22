import { GameGuard } from "../types.ts";

export const canSetUpGuard: GameGuard<"setUpGame"> = (context, event) => {
  return context.players.length < 2 && context.players.find(p => p.id === event.playerId) === undefined
}

export const canStartGuard: GameGuard<"start"> = (context) => {
  return context.players.length === 2
}

export const canThrowGuard: GameGuard<"throwDices"> = (context, event) => {
  const player = context.players.find(p => p.id === event.playerId)!
  return context.curentThrower === event.playerId && player.count < 3 && player.result.length < 6
}

export const canSelectGuard: GameGuard<"selectDices"> = (context, event) => {
  const player = context.players.find(p => p.id === event.playerId)!
  return context.curentThrower === event.playerId && player.result.length < 6
}

export const canChooseGuard: GameGuard<"chooseFavor"> = (context, event) => {
  const player = context.players.find(p => p.id === event.playerId)!
  return !player.isReady && player.result.length === 6
}

export const canToResoluteGuard: GameGuard<"toResolute"> = (context) => {
  return context.players.find(p => p.result.length != 6 && context.players.find(p => !p.isReady)) === undefined
}

export const canFavorOneGuard: GameGuard<"favorOneRes"> = (context) => {
  return context.players.find(p => p.selectedFavor !== undefined && p.selectedFavor.priority < 5) !== undefined
}

export const canFavorTwoGuard: GameGuard<"favorTwoRes"> = (context) => {
  return context.players.find(p => p.selectedFavor !== undefined && p.selectedFavor.priority > 5) !== undefined
}

export const canWinGuard: GameGuard<"resolute"> = (context) => {
  return context.players.find(p => p.stats.pv.current <= 0) != undefined
}

export const canNextTurnGuard: GameGuard<"resolute"> = (context) => {
  return context.players.find(p => p.stats.pv.current <= 0) === undefined
}