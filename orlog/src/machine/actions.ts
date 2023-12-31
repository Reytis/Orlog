import { damageDealt, favorOneApplication, favorTwoApplication, lockingRes, pileOuFace, ppTheft, throwDice } from "../func/gameFunc.ts";
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
        player.result.push(d)
      }
    })
    if (player.result.length === 6) {
      player.count = 3
    }
  }


  player.dices = undefined
  const newCurrent = context.players.find(p => p.id != event.playerId)!.result.length === 6 ? player.id : context.players.find(p => p.id != event.playerId)!.id
  const newPlayer = [
    context.players.find(p => p.id != event.playerId)!,
    player
  ]
  return {
    players: newPlayer,
    curentThrower: newCurrent
  }
}

export const chooseDiceAction:GameAction<"chooseDice"> = (context, event) => {
  const player = context.players.find(p => p.id === event.playerId)! 
  player.dices![event.dice].selected = player.dices![event.dice].selected ? false : true

  const newPlayer = [
    context.players.find(p => p.id !== event.playerId)!,
    player
  ]
  return {
    players: newPlayer
  }
}

export const selectFavorAction:GameAction<"selectFavor"> = (context, event) => {
  const player = context.players.find(p => p.id === event.playerId)!
  
  const updatedFavor = player.favor?.map((f, index) => {
    if (f !== undefined && f.selected !== false) {
      if (f.selected === true && index !== event.selectedFavor) {
        return { ...f, selected: false, sacrifice: event.sacrifice };
      } else if (f.selected === true && index === event.selectedFavor && f.level !== event.level) {
        return { ...f, level: event.level, sacrifice: event.sacrifice}
      }
    }

    if (index === event.selectedFavor) {
      return {
        ...f,
        selected: !f.selected,
        level: event.level,
        sacrifice: event.sacrifice
      };
    }

    return f;
  });


  const updatedPlayer = {
    ...player,
    favor: updatedFavor,
  };

  const updatedPlayers = context.players.map((p) =>
    p.id === event.playerId ? updatedPlayer : p
  );

  return {
    players: updatedPlayers
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

export const favorOneResAction: GameAction<"favorOneRes"> = (context) => {
  let mainP = context.players.find(p => p.id === context.mainPlayer)!
  let otherP = context.players.find(p => p.id !== context.mainPlayer)!

  mainP.stats.pp.update = 0
  otherP.stats.pp.update = 0
  mainP.stats.pv.update = 0
  otherP.stats.pv.update = 0


  mainP.lockRes = lockingRes(mainP)
  otherP.lockRes = lockingRes(otherP)

  if (mainP.selectedFavor && otherP.selectedFavor) {

    if (mainP.selectedFavor?.priority >= otherP.selectedFavor?.priority) {
      let mainPlayerCall = favorOneApplication(mainP, otherP)
      mainP = mainPlayerCall.player
      otherP = mainPlayerCall.opponent
  
      let otherPlayerCall = favorOneApplication(otherP, mainP)
      mainP = otherPlayerCall.player
      otherP = otherPlayerCall.opponent
    } else {
      let otherPlayerCall = favorOneApplication(otherP, mainP)
      mainP = otherPlayerCall.player
      otherP = otherPlayerCall.opponent
  
      let mainPlayerCall = favorOneApplication(mainP, otherP)
      mainP = mainPlayerCall.player
      otherP = mainPlayerCall.opponent
    }
  } else if (mainP.selectedFavor && otherP.selectedFavor === undefined) {

    let mainPlayerCall = favorOneApplication(mainP, otherP)
    mainP = mainPlayerCall.player
    otherP = mainPlayerCall.opponent
    
  } else if (mainP.selectedFavor === undefined && otherP.selectedFavor) {

    let otherPlayerCall = favorOneApplication(otherP, mainP)
    mainP = otherPlayerCall.player
    otherP = otherPlayerCall.opponent

  }

  return {
    players: [mainP, otherP]
  }
}

export const resultResAction: GameAction<"resultRes"> = (context) => {
  let mainP = context.players.find(p => p.id === context.mainPlayer)!
  let otherP = context.players.find(p => p.id !== context.mainPlayer)!

  mainP.stats.pp.update = 0
  otherP.stats.pp.update = 0

  mainP.lockRes = lockingRes(mainP)
  otherP.lockRes = lockingRes(otherP)

  mainP.stats.pv.current = mainP.stats.pv.current - damageDealt(mainP.lockRes, otherP.lockRes)
  mainP.stats.pv.update = -damageDealt(mainP.lockRes, otherP.lockRes)
  otherP.stats.pp.current = otherP.stats.pp.current - ppTheft(otherP.lockRes, mainP.lockRes)
  otherP.stats.pp.update = ppTheft(otherP.lockRes, mainP.lockRes)
  
  otherP.stats.pv.current = otherP.stats.pv.current - damageDealt(otherP.lockRes, mainP.lockRes)
  otherP.stats.pv.update = -damageDealt(otherP.lockRes, mainP.lockRes)
  mainP.stats.pp.current = mainP.stats.pp.current - ppTheft(mainP.lockRes, otherP.lockRes)
  mainP.stats.pp.update = ppTheft(mainP.lockRes, otherP.lockRes)

  return {
    players: [mainP, otherP]
  }
}

export const favorTwoResAction: GameAction<"favorTwoRes"> = (context) => {
  let mainP = context.players.find(p => p.id === context.mainPlayer)!
  let otherP = context.players.find(p => p.id !== context.mainPlayer)!

  mainP.stats.pp.update = 0
  otherP.stats.pp.update = 0
  mainP.stats.pv.update = 0
  otherP.stats.pv.update = 0

  if (mainP.selectedFavor && otherP.selectedFavor) {

    if (mainP.selectedFavor?.priority >= otherP.selectedFavor?.priority) {
      let mainPlayerCall = favorTwoApplication(mainP, otherP)
      mainP = mainPlayerCall.player
      otherP = mainPlayerCall.opponent
  
      let otherPlayerCall = favorTwoApplication(otherP, mainP)
      mainP = otherPlayerCall.player
      otherP = otherPlayerCall.opponent
    } else {
      let otherPlayerCall = favorTwoApplication(otherP, mainP)
      mainP = otherPlayerCall.player
      otherP = otherPlayerCall.opponent
  
      let mainPlayerCall = favorTwoApplication(mainP, otherP)
      mainP = mainPlayerCall.player
      otherP = mainPlayerCall.opponent
    }
  } else if (mainP.selectedFavor && otherP.selectedFavor === undefined) {

    let mainPlayerCall = favorTwoApplication(mainP, otherP)
    mainP = mainPlayerCall.player
    otherP = mainPlayerCall.opponent
    
  } else if (mainP.selectedFavor === undefined && otherP.selectedFavor) {

    let otherPlayerCall = favorTwoApplication(otherP, mainP)
    mainP = otherPlayerCall.player
    otherP = otherPlayerCall.opponent

  }

  return {
    players: [mainP, otherP]
  }
}

export const nextTurnAction: GameAction<"resolute"> = (context) => {
  let mainP = context.players.find(p => p.id === context.mainPlayer)!
  let otherP = context.players.find(p => p.id !== context.mainPlayer)!

  mainP.stats.pp.update = 0
  otherP.stats.pp.update = 0
  mainP.stats.pv.update = 0
  otherP.stats.pv.update = 0

  otherP.favor?.forEach(f => f !== undefined ? f.selected = false : f)
  mainP.favor?.forEach(f => f !== undefined ? f.selected = false : f)

  mainP.selectedFavor = undefined
  otherP.selectedFavor = undefined

  mainP.lockRes = undefined
  otherP.lockRes = undefined

  mainP.spentPP = 0
  mainP.additionalDices = undefined
  mainP.bannedDices = undefined

  otherP.spentPP = 0
  otherP.additionalDices = undefined
  otherP.bannedDices = undefined

  mainP.isReady = false
  otherP.isReady = false

  mainP.count = 0
  otherP.count = 0

  mainP.dices = []
  otherP.dices = []

  mainP.result = []
  otherP.result = []

  mainP.bonus = undefined
  otherP.bonus = undefined

  return {
    players: [mainP, otherP],
    curentThrower: otherP.id,
    mainPlayer: otherP.id
  }
}

export const restartAction: GameAction<"restart"> = (context) => {
  let mainP = context.players.find(p => p.id === context.mainPlayer)!
  let otherP = context.players.find(p => p.id !== context.mainPlayer)!

  mainP.stats.pp.update = 0
  otherP.stats.pp.update = 0
  mainP.stats.pv.update = 0
  otherP.stats.pv.update = 0

  mainP.stats.pp.current = 0
  otherP.stats.pp.current = 0
  mainP.stats.pv.current = 15
  otherP.stats.pv.current = 15

  mainP.selectedFavor = undefined
  otherP.selectedFavor = undefined

  mainP.lockRes = undefined
  otherP.lockRes = undefined

  mainP.spentPP = 0
  mainP.additionalDices = undefined
  mainP.bannedDices = undefined

  otherP.spentPP = 0
  otherP.additionalDices = undefined
  otherP.bannedDices = undefined

  mainP.isReady = false
  otherP.isReady = false

  mainP.count = 0
  otherP.count = 0

  mainP.dices = []
  otherP.dices = []

  mainP.result = []
  otherP.result = []

  return {
    players: [mainP, otherP],
    curentThrower: otherP.id,
    mainPlayer: otherP.id
  }
}

export const leaveAction: GameAction<"leave"> = () => {

  return {
    players: [],
    curentThrower: null,
    mainPlayer: null
  }
}