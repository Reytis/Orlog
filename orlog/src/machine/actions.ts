import { lockingRes, pileOuFace, throwDice } from "../func/gameFunc.ts";
import { GameAction } from "../types.ts";

export const setUpAction: GameAction<"setUpGame"> = (context, event) => ({
  players: [...context.players, {
    id: event.playerId, 
    name: event.playerName, 
    character: event.playerCharacter, 
    favor: event.playerFavor, 
    result: event.playerResult,
    stats: event.playerStat,
    isReady: event.playerIsReady,
    count: event.playerCount,
    dices: event.playerDice
  }]
})

export const startAction: GameAction<"start"> = (context) => {
  const p = pileOuFace(context.players)
  return {
    curentThrower: p,
    mainPlayer: p
  }
}

export const throwDiceAction: GameAction<"throwDices"> = (context, event) => {
  const player = context.players.find(p => p.id === event.playerId)!
  const throwed = [
    throwDice(),
    throwDice(),
    throwDice(),
    throwDice(),
    throwDice(),
    throwDice()
  ]
  player.dices = throwed
  const newPlayer = [
    context.players.find(p => p.id != event.playerId)!,
    player
  ]
  return {
    players: newPlayer
  }
}

export const selectDiceAction: GameAction<"selectDices"> = (context, event) => {
  const player = context.players.find(p => p.id === event.playerId)!
  player.count++
  if (player.count === 3) {
    for (let i = 0; i < 6; i++) {
      if (player.result[i] === undefined) {
        player.result[i] = player.dices![i]
      }
    }
    player.lockRes = lockingRes(player)
  } else {
    player.dices!.forEach(d => {
      if (d.selected) {
        player.result[player.dices!.indexOf(d)] = d
      }
    })
  }

  player.dices = undefined
  const newCurrent = context.players.find(p => p.id != event.playerId)!.id
  const newPlayer = [
    context.players.find(p => p.id != event.playerId)!,
    player
  ]
  return {
    players: newPlayer,
    curentThrower: newCurrent
  }
}

export const chooseFavorAction: GameAction<"chooseFavor"> = (context, event) => {
  const player = context.players.find(p => p.id === event.playerId)!
  player.selectedFavor = event.selectedFavor
  player.isReady = true
  const newPlayer = [
    context.players.find(p => p.id != event.playerId)!,
    player
  ]
  return {
    players: newPlayer
  }
}

export const pointResAction: GameAction<"pointRes"> = (context) => {
  const mainP = context.players.find(p => p.id === context.mainPlayer)!
  const otherP = context.players.find(p => p.id !== context.mainPlayer)!
  mainP.result.forEach(r => {
    if (r!.pp) {
      mainP.stats.pp.update++
      mainP.stats.pp.current++
    }
  })
  otherP.result.forEach(r => {
    if (r!.pp) {
      otherP.stats.pp.update++
      otherP.stats.pp.current++
    }
  })
  return {
    players: [mainP, otherP]
  }
}

export const favorOneResAction: GameAction<"favorOneRes"> = () => {

  return {
    players: []
  }
}