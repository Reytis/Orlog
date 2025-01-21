import { subStates } from "../frontend/PAGES/Game.tsx";
import { Dice, Face, Player, PlayerObject } from "../types.ts";
import { baldrInvulnerability, bragiVerve, brunhildFury, freyjaPlenty, freyrGift, friggSight, heimdallWatch, helGrip, idunnRejuvenation, lokiTrick, mimirWisdom, odinSacrifice, skadiHunt, skuldClain, thorStrike, thrymrTheft, tyrPledge, ullrAim, varBond, vidarMight } from "./favors.ts";
import { v4 as uuidv4 } from "uuid";

//Select Randomly the player who play first
export function pileOuFace(arr:Player[]):Player["id"] {
  return arr[Math.floor(Math.random() * arr.length)].id
}

//Throw a dice and return all data
export function throwDice():Dice {
  const p = Math.floor(Math.random() * 2) === 1
  const f = [Face.axe, Face.bow, Face.hand, Face.helmet, Face.shield]
  return {
    pp: p,
    face: f[Math.floor(Math.random() * f.length)],
    selected: false
  }
}

// Function to calculate the locked results (lockRes) for a player based on their dice rolls and banned dice
export function lockingRes(s: Player): Player['lockRes'] {
  // Initialize the resultLock object to keep track of locked dice results
  let resultLock: Player["lockRes"]
  resultLock = {
    arrow: 0,
    axe: 0,
    hand: 0,
    shield: 0,
    helmet: 0,
  }
  
  // Combine player's dice results and any additional dices they have
  let res = s.additionalDices ? [...s.result, ...s.additionalDices] : s.result
  
  // Loop through each dice result and update the corresponding resultLock value based on the dice face
  res.forEach(r => {
    switch (r!.face) {
      case Face.axe:
      resultLock!.axe++
      break;
      case Face.helmet:
      resultLock!.helmet++
      break;
      case Face.bow:
      resultLock!.arrow++
      break;
      case Face.hand:
      resultLock!.hand++
      break;
      case Face.shield:
      resultLock!.shield++
      break;
      default:
      break;
    }
  })
  
  // Initialize bannedDice to track the number of banned dice by face type
  let bannedDice = {
    arrow: 0,
    axe: 0,
    hand: 0,
    shield: 0,
    helmet: 0,
  }
  
  // If the player has banned dice, loop through and count the banned dice by face
  if (s.bannedDices) {
    s.bannedDices.forEach(r => {
      switch (r!.face) {
        case Face.axe:
        bannedDice!.axe++
        break;
        case Face.helmet:
        bannedDice!.helmet++
        break;
        case Face.bow:
        bannedDice!.arrow++
        break;
        case Face.hand:
        bannedDice!.hand++
        break;
        case Face.shield:
        bannedDice!.shield++
        break;
        default:
        break;
      }
    })    
  }
  
  // Subtract the number of banned dice from the corresponding locked result in resultLock
  resultLock.arrow = resultLock.arrow - bannedDice.arrow
  resultLock.axe = resultLock.axe - bannedDice.axe
  resultLock.hand = resultLock.hand - bannedDice.hand
  resultLock.shield = resultLock.shield - bannedDice.shield
  resultLock.helmet = resultLock.helmet - bannedDice.helmet
  
  // Return the final locked result with adjustments for banned dice
  return resultLock
}


//Calculate the amount of damage dealt to a player based on Player['lockRes']
export function axeDamageDealt(receiver: Player['lockRes'], dealer: Player['lockRes']): number {
  let damage = 0
  damage = (dealer!.axe - receiver!.helmet) < 0 ? 0 : (dealer!.axe - receiver!.helmet)
  
  return damage
} //Calcul of AXE
export function arrowDamageDealt(receiver: Player['lockRes'], dealer: Player['lockRes']): number {
  let damage = 0
  damage = (dealer!.arrow - receiver!.shield) < 0 ? 0 : (dealer!.arrow - receiver!.shield)
  
  return damage
} //Calcul of ARROW

export function damageDealt(receiver: Player['lockRes'], dealer: Player['lockRes']): number {
  return axeDamageDealt(receiver, dealer) + arrowDamageDealt(receiver, dealer)
} //Calcul of ALL 

//Calculate the amount of PP stole 
export function ppTheft(receiver: Player['lockRes'], dealer: Player['lockRes']):number {
  return dealer!.hand - receiver!.hand
}

//Calculate the amount of damage blocked by the player based on Player['lockRes']
export function helmetDamageBlock(receiver: Player['lockRes'], dealer: Player['lockRes']): number {
  let damageBlock = 0
  
  damageBlock = (receiver!.helmet - dealer!.axe) <= 0 ? receiver!.helmet : receiver!.helmet - (receiver!.helmet - dealer!.axe)
  
  return damageBlock
} //Calcul of HELMET
export function shieldDamageBlock(receiver: Player['lockRes'], dealer: Player['lockRes']): number {
  let damageBlock = 0
  
  damageBlock = (receiver!.shield - dealer!.arrow) <= 0 ? receiver!.shield : receiver!.shield - (receiver!.shield - dealer!.arrow)
  
  return damageBlock
} //Calcul of SHIELD

export function damageBlock(receiver: Player['lockRes'], dealer: Player['lockRes']): number {
  return shieldDamageBlock(receiver, dealer) + helmetDamageBlock(receiver, dealer)
} //Calcul of ALL

export function favorOneApplication(Caller: Player, Target: Player) {
  // favor is the currently selected favor of the caller
  let favor = Caller.selectedFavor!
  let caller: Player = { ...Caller }
  let target: Player = { ...Target }
  
  // Check if favor exists and has priority less than 5 (favors with priority < 5 are valid)
  if (!favor === undefined || favor.priority < 5) {
    let value
    // Switch statement to handle the logic for different favor names
    switch (favor.name) {
      
      // If target has a selected favor, apply Thrymr's theft logic
      case 'thrymr':
      if (Target.selectedFavor) {
        value = thrymrTheft(favor.level!, Target.selectedFavor,)
      }
      // Update the stats of the caller and target based on the theft result
      if (value && value.spentPP <= caller.stats.pp.current) {
        caller.stats.pp.current = caller.stats.pp.current - value.spentPP
        caller.stats.pp.update = -value.spentPP
        target.selectedFavor = value.newTargetFavor
      }
      break;
      
      // If target has a selected favor, apply Var's bond logic
      case 'var':
      if (Target.selectedFavor) {
        value = varBond(favor.level!, Target.selectedFavor)
      }
      // Update PP and HP based on the bond result
      if (value && value.spentPP <= caller.stats.pp.current) {
        caller.stats.pp.current = caller.stats.pp.current - value.spentPP
        caller.stats.pp.update = -value.spentPP
        caller.stats.pv.current = caller.stats.pv.current + value.healPV
        caller.stats.pv.update = value.healPV
      }
      break;
      
      // Apply Loki's trick and adjust banned dices and locked results
      case 'loki':
      value = lokiTrick(favor.level!, Target.result)
      if (value && value.spentPP <= caller.stats.pp.current) {
        caller.stats.pp.current = caller.stats.pp.current - value.spentPP
        caller.stats.pp.update = -value.spentPP
        target.bannedDices = value.diceToBan
        target.lockRes = lockingRes(target)
      }
      break;

      // Apply Freyja's plenty to add additional dices to the caller
      case 'freyja':
      value = freyjaPlenty(favor.level!)
      if (value && value.spentPP <= caller.stats.pp.current) {
        caller.stats.pp.current = caller.stats.pp.current - value.spentPP
        caller.stats.pp.update = -value.spentPP
        caller.additionalDices = value.additionalDices
        caller.lockRes = lockingRes(caller)
      }
      break;
      
      // Frigg's favor: Allows rerolling dice and adjusting results based on sight power
      case 'frigg':
      value = friggSight(favor.level!, favor.target === 'self' ? Caller.result : Target.result)
      
      // Check if Frigg's sight power is available and enough PP (Power Points) are available
      if (value && value.spentPP <= caller.stats.pp.current) {
        // Deduct the spent PP from the caller's current PP
        caller.stats.pp.current = caller.stats.pp.current - value.spentPP
        caller.stats.pp.update = -value.spentPP
        
        // Update the result of either the caller or the target, based on the favor target
        favor.target === 'self' ?
        caller.result = value.rerolledDices :
        target.result = value.rerolledDices
        
        // Recalculate the locked results (lockRes) for both the caller and the target
        caller.lockRes = lockingRes(caller)
        target.lockRes = lockingRes(target)
      }
      break;
      
      // Tyr's favor: Involves a pledge that costs PP and a sacrifice of health (PV), reducing target's PP
      case 'tyr':
      value = tyrPledge(favor.level!, favor.sacrifice!)
      
      // Check if the power is available, PP is sufficient, and the caller's health is enough to make the sacrifice
      if (value && value.spentPP <= caller.stats.pp.current && caller.stats.pv.current > favor.sacrifice!) {
        // Deduct the spent PP and update PP status
        caller.stats.pp.current = caller.stats.pp.current - value.spentPP
        caller.stats.pp.update = -value.spentPP
        
        // Deduct the sacrificed PV (health) and update health status
        caller.stats.pv.current = caller.stats.pv.current - favor.sacrifice!
        caller.stats.pv.update = favor.sacrifice!
        
        // Deduct the lost PP from the target, ensuring it doesn't go below zero
        target.stats.pp.current > value.targetLostPP ?
        target.stats.pp.current = target.stats.pp.current - value.targetLostPP :
        target.stats.pp.current = 0 
      }
      break;
      
      // Skuld's favor: Drains Power Points (PP) from the target
      case 'skuld':
      value = skuldClain(favor.level!, Caller, Target)
      
      // Check if PP is sufficient and proceed with the ability
      if (value && value.spentPP <= caller.stats.pp.current) {
        // Deduct the spent PP from the caller
        caller.stats.pp.current = caller.stats.pp.current - value.spentPP
        caller.stats.pp.update = -value.spentPP
        
        // Reduce the target's PP, ensuring it doesn't drop below zero
        target.stats.pp.current > value.targetLostPP ?
        target.stats.pp.current = target.stats.pp.current - value.targetLostPP :
        target.stats.pp.current = 0 
      }
      break;
      
      // Freyr's favor: Transfers PP to the caller
      case 'freyr':
      value = freyrGift(favor.level!, Caller, Target)
      
      // Check if PP is sufficient to perform the ability
      if (value && value.spentPP <= caller.stats.pp.current) {
        // Deduct the spent PP and update the caller's PP
        caller.stats.pp.current = caller.stats.pp.current - value.spentPP
        caller.stats.pp.update = value.PPToGift - value.spentPP
        
        // Add the gifted PP to the caller
        caller.stats.pp.current = caller.stats.pp.current + value.PPToGift 
      }
      break;
      
      // Skadi's favor: Increases the number of arrows locked for the caller
      case 'skadi':
      value = skadiHunt(favor.level!, Caller, Target)
      
      // Check if PP is sufficient for the ability
      if (value && value.spentPP <= caller.stats.pp.current) {
        // Deduct the spent PP
        caller.stats.pp.current = caller.stats.pp.current - value.spentPP
        caller.stats.pp.update = -value.spentPP 
        
        // Recalculate the locked results and increase the number of locked arrows
        caller.lockRes = lockingRes(Caller)
        caller.lockRes!.arrow += value.arrowToAdd
        caller.bonus = value.bonus
      }
      break;
      
      // Mimir's favor: Grants wisdom, increasing the caller's PP
      case 'mimir':
      value = mimirWisdom(favor.level!, Caller, Target)
      
      // Check if PP is sufficient
      if (value && value.spentPP <= caller.stats.pp.current) {
        // Deduct spent PP and then add the additional PP gained
        caller.stats.pp.current = caller.stats.pp.current - value.spentPP
        caller.stats.pp.update = value.ppToAdd - value.spentPP
        
        // Add the PP gained from Mimir's wisdom
        caller.stats.pp.current = caller.stats.pp.current + value.ppToAdd 
      }
      break;
      
      // Bragi's favor: Enhances verve, boosting PP
      case 'bragi':
      value = bragiVerve(favor.level!, Caller, Target)
      
      // Check if PP is sufficient
      if (value && value.spentPP <= caller.stats.pp.current) {
        // Deduct spent PP and then add the additional PP gained
        caller.stats.pp.current = caller.stats.pp.current - value.spentPP
        caller.stats.pp.update = value.ppToAdd - value.spentPP
        
        // Add the PP gained from Bragi's verve
        caller.stats.pp.current = caller.stats.pp.current + value.ppToAdd 
      }
      break;
      
      // Vidar's favor: Increases the target's locked results and grants bonuses
      case 'vidar':
      value = vidarMight(favor.level!, Target)
      
      // Check if PP is sufficient
      if (value && value.spentPP <= caller.stats.pp.current) {
        // Deduct the spent PP
        caller.stats.pp.current = caller.stats.pp.current - value.spentPP
        caller.stats.pp.update = -value.spentPP 
        
        // Apply new locked results and bonuses to the target
        target.lockRes = value.newTargetLockRes
        target.bonus = value.bonus
      }
      break;
      
      // Brunhild's favor: Grants fury, adjusting the caller's locked results and bonuses
      case 'brunhild':
      value = brunhildFury(favor.level!, Caller)
      
      // Check if PP is sufficient
      if (value && value.spentPP <= caller.stats.pp.current) {
        // Deduct the spent PP
        caller.stats.pp.current = caller.stats.pp.current - value.spentPP
        caller.stats.pp.update = -value.spentPP 
        
        // Apply new locked results and bonuses to the caller
        caller.lockRes = value.newTargetLockRes
        caller.bonus = value.bonus
      }
      break;
      
      // Baldr's favor: Grants invulnerability, adjusting the caller's locked results and bonuses
      case 'baldr':
      value = baldrInvulnerability(favor.level!, Caller)
      
      // Check if PP is sufficient
      if (value && value.spentPP <= caller.stats.pp.current) {
        // Deduct the spent PP
        caller.stats.pp.current = caller.stats.pp.current - value.spentPP
        caller.stats.pp.update = -value.spentPP 
        
        // Apply new locked results and bonuses to the caller
        caller.lockRes = value.newTargetLockRes
        caller.bonus = value.bonus
      }
      break;
      
      // Ullr's favor: Enhances the target's aim, adjusting their locked results and bonuses
      case 'ullr':
      value = ullrAim(favor.level!, Target)
      
      // Check if PP is sufficient
      if (value && value.spentPP <= caller.stats.pp.current) {
        // Deduct the spent PP
        caller.stats.pp.current = caller.stats.pp.current - value.spentPP
        caller.stats.pp.update = -value.spentPP 
        
        // Apply new locked results and bonuses to the target
        target.lockRes = value.newTargetLockRes
        target.bonus = value.bonus
      }
      break;
      
      // Heimdall's favor: Heals the caller by restoring health (PV)
      case 'heimdall':
      value = heimdallWatch(favor.level!, Caller, Target)
      
      // Check if PP is sufficient
      if (value && value.spentPP <= caller.stats.pp.current) {
        // Deduct the spent PP
        caller.stats.pp.current = caller.stats.pp.current - value.spentPP
        caller.stats.pp.update = -value.spentPP 
        
        // Heal the caller by adding to their current health (PV)
        caller.stats.pv.current += value.pvToHeal
        caller.stats.pv.update = value.pvToHeal
      }
      break;
      
      // Hel's favor: Provides healing by restoring health (PV) to the caller
      case 'hel':
      value = helGrip(favor.level!, Caller, Target)
      
      // Check if PP is sufficient
      if (value && value.spentPP <= caller.stats.pp.current) {
        // Deduct the spent PP
        caller.stats.pp.current = caller.stats.pp.current - value.spentPP
        caller.stats.pp.update = -value.spentPP 
        
        // Heal the caller by adding to their current health (PV)
        caller.stats.pv.current += value.pvToHeal
        caller.stats.pv.update = value.pvToHeal
      }
      break;
      
      default:
        break;
    }
  }
  
  // Return the updated player and opponent after applying the favor's effects
  return {
    player: caller,
    opponent: target
  }
}

export function favorTwoApplication(Caller: Player, Target: Player) {
  let favor = Caller.selectedFavor!
  let caller: Player = { ...Caller }
  let target: Player = { ...Target }
  
  // Check if favor exists and has priority less than 5
  if (!favor === undefined || favor.priority < 5) {
    switch (favor.name) {
      case 'thor':
      // Apply Thor's strike logic and update the PP and HP of the target
      let value
      value = thorStrike(favor.level!)
      if (value && value.spentPP <= caller.stats.pp.current) {
        caller.stats.pp.current = caller.stats.pp.current - value.spentPP
        caller.stats.pp.update = -value.spentPP
        target.stats.pv.current = target.stats.pv.current - value.dmgToDeal
        target.stats.pv.update = -value.dmgToDeal
      }
      break;
      
      case 'odin':
      // Apply Odin's sacrifice logic, sacrifice health to gain PP
      value = odinSacrifice(favor.level!, favor.sacrifice!)
      if (value && value.spentPP <= caller.stats.pp.current) {
        caller.stats.pp.current = caller.stats.pp.current - value.spentPP + value.ppToAdd
        caller.stats.pp.update = -value.spentPP + value.ppToAdd
        caller.stats.pv.current = caller.stats.pv.current - value.pvSacrified
        caller.stats.pv.update = -value.pvSacrified
      }
      break;
      
      case 'idunn':
      // Apply Idunn's rejuvenation, heal caller's HP
      value = idunnRejuvenation(favor.level!)
      if (value && value.spentPP <= caller.stats.pp.current) {
        caller.stats.pp.current = caller.stats.pp.current - value.spentPP
        caller.stats.pp.update = -value.spentPP
        caller.stats.pv.current = caller.stats.pv.current - value.pvToHeal
        caller.stats.pv.update = +value.pvToHeal
      }
      break;
      
      // Handle other favors like helGrip, etc., similarly
      
      default:
      break;
    }
  }
  
  // Return the updated player and opponent after applying favor effects
  return {
    player: caller,
    opponent: target
  }
}

export function sortResultDices(face: Face, second: boolean) {
  let n = 0
  // Switch statement to assign numeric value to each dice face based on whether it's second roll
  if (second) {
    switch (face) {
      case Face.axe:
      n = 3
      break;
      case Face.hand:
      n = 8
      break;
      case Face.helmet:
      n = 1
      break;
      case Face.bow:
      n = 4
      break;
      case Face.shield:
      n = 2
      break;
      default:
      break;
    }
  } else {
    // First roll face values
    switch (face) {
      case Face.axe:
      n = 1
      break;
      case Face.hand:
      n = 8
      break;
      case Face.helmet:
      n = 3
      break;
      case Face.bow:
      n = 2
      break;
      case Face.shield:
      n = 4
      break;
      default:
      break;
    }
  }
  // Return the numeric value for sorting
  return n
}

// Function to convert Player to PlayerObject
export function convertPlayerToPlayerObject(player: Player): PlayerObject {
  return {
    name: player.name,
    character: player.character ? [player.character] : [], // Assuming character is an optional single object, convert it to an array
    favors: player.favor || [], // Favors can be an array or empty if undefined
    position: player.id, // Set position to player's id
  };
}

// utils to create or get unique id for game session
export const getUserId = () => {
  let userId = localStorage.getItem('userId');
  if (!userId) {
    userId = uuidv4(); // Generate unique id
    localStorage.setItem('userId', userId!);
  }
  return userId;
}

export const isMyTurn = (id: string) => {
  return localStorage.getItem('myTurnId') === id;
}

export const setMyTurnId = (id: string) => {
  localStorage.setItem('myTurnId', id);
}

export const resetMyTurnId = (id: string) => {
  if (isMyTurn(id)) {
    localStorage.removeItem('myTurnId')
  }
}
