// Importing necessary game functions and types from other files
import { damageDealt, favorOneApplication, favorTwoApplication, lockingRes, pileOuFace, ppTheft, throwDice } from "../func/gameFunc.ts";
import { GameAction } from "../types.ts";

// Action to set up a player in the game
export const setUpAction: GameAction<"setUpGame"> = (context, event) => ({
  // Adds a new player to the list of players in the game
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

// Action to start the game and set the current thrower and main player
export const startAction: GameAction<"start"> = (context) => {
  // Determine the starting player using the pileOuFace function
  const p = pileOuFace(context.players)
  return {
    curentThrower: p,  // Set the current thrower
    mainPlayer: p      // Set the main player
  }
}

// Action to handle the throwing of dice by a player
export const throwDiceAction: GameAction<"throwDices"> = (context, event) => {
  const player = context.players.find(p => p.id === event.playerId)! // Find the player by ID
  // Throw 6 dice and update the player's dice state
  const throwed = [
    throwDice(),
    throwDice(),
    throwDice(),
    throwDice(),
    throwDice(),
    throwDice()
  ]
  player.dices = throwed  // Update the player's dice with the new throws
  // Update the list of players
  const newPlayer = [
    context.players.find(p => p.id != event.playerId)!,
    player
  ]
  return {
    players: newPlayer  // Return updated players
  }
}

// Action to select the dice a player wants to keep
export const selectDiceAction: GameAction<"selectDices"> = (context, event) => {
  const player = context.players.find(p => p.id === event.playerId)!  // Find the player by ID
  player.count++  // Increment the player's dice selection count

  // If the player has reached 3 rolls, lock their result
  if (player.count === 3) {
    for (let i = 0; i < 6; i++) {
      if (player.result[i] === undefined) {
        player.result[i] = player.dices![i]  // Assign the dice result
      }
    }
    player.lockRes = lockingRes(player)  // Lock the player's result
  } else {
    // Push selected dice to the result
    player.dices!.forEach(d => {
      if (d.selected) {
        player.result.push(d)
      }
    })
    // If the player has selected 6 dice, set their count to 3
    if (player.result.length === 6) {
      player.count = 3
    }
  }

  // Clear the player's dice after selection
  player.dices = undefined
  // Determine the new current thrower based on the other player's progress
  const newCurrent = context.players.find(p => p.id != event.playerId)!.result.length === 6 ? player.id : context.players.find(p => p.id != event.playerId)!.id
  const newPlayer = [
    context.players.find(p => p.id != event.playerId)!,
    player
  ]
  return {
    players: newPlayer,         // Return updated players
    curentThrower: newCurrent   // Set the new current thrower
  }
}

// Action to toggle the selection of a dice
export const chooseDiceAction: GameAction<"chooseDice"> = (context, event) => {
  const player = context.players.find(p => p.id === event.playerId)!  // Find the player by ID
  // Toggle the selected state of the dice
  player.dices![event.dice].selected = player.dices![event.dice].selected ? false : true

  // Update the player list
  const newPlayer = [
    context.players.find(p => p.id !== event.playerId)!,
    player
  ]
  return {
    players: newPlayer  // Return updated players
  }
}

// Action to select a favor for the player
export const selectFavorAction: GameAction<"selectFavor"> = (context, event) => {
  const player = context.players.find(p => p.id === event.playerId)!  // Find the player by ID
  
  // Update the player's favor selection
  const updatedFavor = player.favor?.map((f, index) => {
    if (f !== undefined && f.selected !== false) {
      // Deselect the favor if the selected one changes
      if (f.selected === true && index !== event.selectedFavor) {
        return { ...f, selected: false, sacrifice: event.sacrifice };
      } else if (f.selected === true && index === event.selectedFavor && f.level !== event.level) {
        return { ...f, level: event.level, sacrifice: event.sacrifice}
      }
    }
    // Select or deselect favor
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
    players: updatedPlayers  // Return updated players with new favor selection
  }
}

// Action to confirm a player's favor choice and set them as ready
export const chooseFavorAction: GameAction<"chooseFavor"> = (context, event) => {
  const player = context.players.find(p => p.id === event.playerId)!  // Find the player by ID
  player.selectedFavor = event.selectedFavor  // Set the selected favor
  player.isReady = true  // Mark the player as ready
  const newPlayer = [
    context.players.find(p => p.id != event.playerId)!,
    player
  ]
  return {
    players: newPlayer  // Return updated players
  }
}

// Action to resolve the result of a round and update player stats
export const pointResAction: GameAction<"pointRes"> = (context) => {
  const mainP = context.players.find(p => p.id === context.mainPlayer)!  // Main player
  const otherP = context.players.find(p => p.id !== context.mainPlayer)!  // Other player

  // Update PP (power points) for both players
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
    players: [mainP, otherP]  // Return updated players with new stats
  }
}

// Action to resolve favor 1 actions for both players
export const favorOneResAction: GameAction<"favorOneRes"> = (context) => {
  let mainP = context.players.find(p => p.id === context.mainPlayer)!  // Main player
  let otherP = context.players.find(p => p.id !== context.mainPlayer)!  // Other player

  // Reset PP and PV (health points) updates
  mainP.stats.pp.update = 0
  otherP.stats.pp.update = 0
  mainP.stats.pv.update = 0
  otherP.stats.pv.update = 0

  // Lock results for both players
  mainP.lockRes = lockingRes(mainP)
  otherP.lockRes = lockingRes(otherP)

  // Apply favor based on priority and whether each player has selected a favor
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
    players: [mainP, otherP]  // Return updated players after favor application
  }
}

// Action to resolve the result of the round, apply damage and PP theft between players
export const resultResAction: GameAction<"resultRes"> = (context) => {
  let mainP = context.players.find(p => p.id === context.mainPlayer)! // Main player
  let otherP = context.players.find(p => p.id !== context.mainPlayer)! // Opponent player

  // Reset PP (Power Points) update for both players
  mainP.stats.pp.update = 0
  otherP.stats.pp.update = 0

  // Lock the results for both players
  mainP.lockRes = lockingRes(mainP)
  otherP.lockRes = lockingRes(otherP)

  // Apply damage dealt to the main player's health (PV)
  mainP.stats.pv.current = mainP.stats.pv.current - damageDealt(mainP.lockRes, otherP.lockRes)
  mainP.stats.pv.update = -damageDealt(mainP.lockRes, otherP.lockRes)
  
  // Apply PP theft from the opponent to the main player
  otherP.stats.pp.current = otherP.stats.pp.current - ppTheft(otherP.lockRes, mainP.lockRes)
  otherP.stats.pp.update = ppTheft(otherP.lockRes, mainP.lockRes)
  
  // Apply damage dealt to the opponent's health (PV)
  otherP.stats.pv.current = otherP.stats.pv.current - damageDealt(otherP.lockRes, mainP.lockRes)
  otherP.stats.pv.update = -damageDealt(otherP.lockRes, mainP.lockRes)
  
  // Apply PP theft from the main player to the opponent
  mainP.stats.pp.current = mainP.stats.pp.current - ppTheft(mainP.lockRes, otherP.lockRes)
  mainP.stats.pp.update = ppTheft(mainP.lockRes, otherP.lockRes)

  return {
    players: [mainP, otherP] // Return updated players
  }
}

// Action to resolve favor type 2 actions (favorTwoApplication) between players
export const favorTwoResAction: GameAction<"favorTwoRes"> = (context) => {
  let mainP = context.players.find(p => p.id === context.mainPlayer)! // Main player
  let otherP = context.players.find(p => p.id !== context.mainPlayer)! // Opponent player

  // Reset PP and PV updates for both players
  mainP.stats.pp.update = 0
  otherP.stats.pp.update = 0
  mainP.stats.pv.update = 0
  otherP.stats.pv.update = 0

  // If both players have selected favors, apply favors based on priority
  if (mainP.selectedFavor && otherP.selectedFavor) {
    // Main player has higher or equal priority favor
    if (mainP.selectedFavor?.priority >= otherP.selectedFavor?.priority) {
      let mainPlayerCall = favorTwoApplication(mainP, otherP)
      mainP = mainPlayerCall.player
      otherP = mainPlayerCall.opponent

      let otherPlayerCall = favorTwoApplication(otherP, mainP)
      mainP = otherPlayerCall.player
      otherP = otherPlayerCall.opponent
    } else {
      // Opponent player has higher priority favor
      let otherPlayerCall = favorTwoApplication(otherP, mainP)
      mainP = otherPlayerCall.player
      otherP = otherPlayerCall.opponent

      let mainPlayerCall = favorTwoApplication(mainP, otherP)
      mainP = mainPlayerCall.player
      otherP = mainPlayerCall.opponent
    }
  } else if (mainP.selectedFavor && !otherP.selectedFavor) {
    // Only main player has selected a favor
    let mainPlayerCall = favorTwoApplication(mainP, otherP)
    mainP = mainPlayerCall.player
    otherP = mainPlayerCall.opponent
  } else if (!mainP.selectedFavor && otherP.selectedFavor) {
    // Only opponent player has selected a favor
    let otherPlayerCall = favorTwoApplication(otherP, mainP)
    mainP = otherPlayerCall.player
    otherP = otherPlayerCall.opponent
  }

  return {
    players: [mainP, otherP] // Return updated players
  }
}

// Action to reset the game state for the next turn
export const nextTurnAction: GameAction<"resolute"> = (context) => {
  let mainP = context.players.find(p => p.id === context.mainPlayer)! // Main player
  let otherP = context.players.find(p => p.id !== context.mainPlayer)! // Opponent player

  // Reset PP and PV updates for both players
  mainP.stats.pp.update = 0
  otherP.stats.pp.update = 0
  mainP.stats.pv.update = 0
  otherP.stats.pv.update = 0

  // Deselect all favors for both players
  otherP.favor?.forEach(f => f !== undefined ? f.selected = false : f)
  mainP.favor?.forEach(f => f !== undefined ? f.selected = false : f)

  // Reset selected favor and locked results for both players
  mainP.selectedFavor = undefined
  otherP.selectedFavor = undefined

  mainP.lockRes = undefined
  otherP.lockRes = undefined

  // Reset PP, additional dice, and banned dice for both players
  mainP.spentPP = 0
  mainP.additionalDices = undefined
  mainP.bannedDices = undefined

  otherP.spentPP = 0
  otherP.additionalDices = undefined
  otherP.bannedDices = undefined

  // Reset readiness and count for both players
  mainP.isReady = false
  otherP.isReady = false
  mainP.count = 0
  otherP.count = 0

  // Reset dice and results for both players
  mainP.dices = []
  otherP.dices = []
  mainP.result = []
  otherP.result = []

  // Clear any bonuses
  mainP.bonus = undefined
  otherP.bonus = undefined

  return {
    players: [mainP, otherP],  // Return updated players
    curentThrower: otherP.id,  // Set the new thrower to the other player
    mainPlayer: otherP.id      // Set the new main player to the other player
  }
}

// Action to restart the game, resetting all stats and the game state
export const restartAction: GameAction<"restart"> = (context) => {
  let mainP = context.players.find(p => p.id === context.mainPlayer)! // Main player
  let otherP = context.players.find(p => p.id !== context.mainPlayer)! // Opponent player

  // Reset PP and PV updates for both players
  mainP.stats.pp.update = 0
  otherP.stats.pp.update = 0
  mainP.stats.pv.update = 0
  otherP.stats.pv.update = 0

  // Reset current PP and PV values
  mainP.stats.pp.current = 0
  otherP.stats.pp.current = 0
  mainP.stats.pv.current = 15
  otherP.stats.pv.current = 15

  // Reset favors and locked results
  mainP.selectedFavor = undefined
  otherP.selectedFavor = undefined
  mainP.lockRes = undefined
  otherP.lockRes = undefined

  // Reset spent PP, additional dice, and banned dice for both players
  mainP.spentPP = 0
  mainP.additionalDices = undefined
  mainP.bannedDices = undefined

  otherP.spentPP = 0
  otherP.additionalDices = undefined
  otherP.bannedDices = undefined

  // Reset readiness and dice rolls
  mainP.isReady = false
  otherP.isReady = false
  mainP.count = 0
  otherP.count = 0
  mainP.dices = []
  otherP.dices = []
  mainP.result = []
  otherP.result = []

  return {
    players: [mainP, otherP],  // Return updated players
    curentThrower: otherP.id,  // Set the new thrower to the other player
    mainPlayer: otherP.id      // Set the new main player to the other player
  }
}

// Action to handle when a player leaves the game, clearing the game state
export const leaveAction: GameAction<"leave"> = () => {

  return {
    players: [],          // Clear the list of players
    curentThrower: null,  // Clear the current thrower
    mainPlayer: null      // Clear the main player
  }
}
