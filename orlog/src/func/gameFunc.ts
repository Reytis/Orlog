import { Dice, Face, Player } from "../types.ts";

//Select Randomly the player who play first
export function pileOuFace(arr:Player[]):Player["id"] {
  return arr[Math.floor(Math.random() * arr.length)].id
}

//Throw a dice en return all data
export function throwDice():Dice {
  const p = Math.floor(Math.random() * 2) === 1
  const f = [Face.axe, Face.bow, Face.hand, Face.helmet, Face.shield]
  return {
    pp: p,
    face: f[Math.floor(Math.random() * f.length)],
    selected: false
  }
}

//Calculate the numbuer of each face in the player result 
export function lockingRes(s: Player): Player['lockRes'] {
  let resultLock:Player["lockRes"]
  if (s.lockRes !== undefined) {
    resultLock = s.lockRes
  } else {
    resultLock = {
      arrow: 0,
      axe: 0,
      hand: 0,
      shield: 0,
      helmet: 0,
    }
  }
  let res = s.additionalDices ? [...s.result, ...s.additionalDices] : s.result
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
  return resultLock
}

//Calculate the amount of damage dealt to a player based on Player['lockRes']
export function axeDamageDealt(receiver: Player['lockRes'], dealer: Player['lockRes']): number {
  let damage = 0
  damage = (dealer!.axe - receiver!.helmet) < 0 ? 0 : (dealer!.axe - receiver!.helmet)

  return damage
}
export function arrowDamageDealt(receiver: Player['lockRes'], dealer: Player['lockRes']): number {
  let damage = 0
  damage = (dealer!.arrow - receiver!.shield) < 0 ? 0 : (dealer!.arrow - receiver!.shield)

  return damage
}

export function damageDealt(receiver: Player['lockRes'], dealer: Player['lockRes']): number {
  return axeDamageDealt(receiver, dealer) + arrowDamageDealt(receiver, dealer)
}

//Calculate the amount of damage blocked by the player based on Player['lockRes']
export function helmetDamageBlock(receiver: Player['lockRes'], dealer: Player['lockRes']): number {
  let damageBlock = 0

  damageBlock = (receiver!.helmet - dealer!.axe) <= 0 ? receiver!.helmet : receiver!.helmet - (receiver!.helmet - dealer!.axe)
  
  return damageBlock
}
export function shieldDamageBlock(receiver: Player['lockRes'], dealer: Player['lockRes']): number {
  let damageBlock = 0

  damageBlock = (receiver!.shield - dealer!.arrow) <= 0 ? receiver!.shield : receiver!.shield - (receiver!.shield - dealer!.arrow)
  
  return damageBlock
}

export function damageBlock(receiver: Player['lockRes'], dealer: Player['lockRes']): number {
    return shieldDamageBlock(receiver, dealer) + helmetDamageBlock(receiver, dealer)
}