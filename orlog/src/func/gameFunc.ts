import { Dice, Face, Player } from "../types.ts";
import { baldrInvulnerability, bragiVerve, brunhildFury, freyjaPlenty, freyrGift, friggSight, heimdallWatch, helGrip, idunnRejuvenation, lokiTrick, mimirWisdom, odinSacrifice, skadiHunt, skuldClain, thorStrike, thrymrTheft, tyrPledge, ullrAim, varBond, vidarMight } from "./favors.ts";

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
  resultLock = {
    arrow: 0,
    axe: 0,
    hand: 0,
    shield: 0,
    helmet: 0,
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

  let bannedDice = {
    arrow: 0,
    axe: 0,
    hand: 0,
    shield: 0,
    helmet: 0,
  }
  if(s.bannedDices) {
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

  resultLock.arrow = resultLock.arrow - bannedDice.arrow
  resultLock.axe = resultLock.axe - bannedDice.axe
  resultLock.hand = resultLock.hand - bannedDice.hand
  resultLock.shield = resultLock.shield - bannedDice.shield
  resultLock.helmet = resultLock.helmet - bannedDice.helmet

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

export function favorOneApplication(Caller: Player, Target: Player) {
  let favor = Caller.selectedFavor!
  let caller:Player = {...Caller}
  let target:Player = {...Target}

  if (!favor === undefined || favor.priority < 5) {
    switch (favor.name) {
      case 'thrymr':
        let value

        if (Target.selectedFavor) {
          value = thrymrTheft(favor.level!, Target.selectedFavor,)
        }

        if (value && value.spentPP <= caller.stats.pp.current) {
          caller.stats.pp.current = caller.stats.pp.current - value.spentPP
          caller.stats.pp.update = -value.spentPP
          target.selectedFavor = value.newTargetFavor
        }
        break;
      case 'var':
        if (Target.selectedFavor) {
        value = varBond(favor.level!, Target.selectedFavor)
        }

        if (value && value.spentPP <= caller.stats.pp.current) {
          caller.stats.pp.current = caller.stats.pp.current - value.spentPP
          caller.stats.pp.update = -value.spentPP
          caller.stats.pv.current = caller.stats.pv.current + value.healPV
          caller.stats.pv.update = value.healPV
        }
        break;
      case 'loki':
        value = lokiTrick(favor.level!, Target.result)

        if (value && value.spentPP <= caller.stats.pp.current) {
          caller.stats.pp.current = caller.stats.pp.current - value.spentPP
          caller.stats.pp.update = -value.spentPP
          target.bannedDices = value.diceToBan

          target.lockRes = lockingRes(target)
        }
        break;
      case 'freyja':

        value = freyjaPlenty(favor.level!)
        if (value && value.spentPP <= caller.stats.pp.current) {
          caller.stats.pp.current = caller.stats.pp.current - value.spentPP
          caller.stats.pp.update = -value.spentPP
          caller.additionalDices = value.additionalDices

          caller.lockRes = lockingRes(caller)
        }
        break;
      case 'frigg':
        value = friggSight(favor.level!, favor.target === 'self' ? Caller.result : Target.result)

        if (value && value.spentPP <= caller.stats.pp.current) {
          caller.stats.pp.current = caller.stats.pp.current - value.spentPP
          caller.stats.pp.update = -value.spentPP

          favor.target === 'self' ?
            caller.result = value.rerolledDices :
            target.result = value.rerolledDices

            caller.lockRes = lockingRes(caller)
            target.lockRes = lockingRes(target)
          }
        break;
      case 'tyr':
        value = tyrPledge(favor.level!, favor.sacrifice!)

        if (value && value.spentPP <= caller.stats.pp.current && caller.stats.pv.current > favor.sacrifice!) {
          caller.stats.pp.current = caller.stats.pp.current - value.spentPP
          caller.stats.pp.update = -value.spentPP

          caller.stats.pv.current = caller.stats.pv.current - favor.sacrifice!
          caller.stats.pv.update = favor.sacrifice!

          target.stats.pp.current > value.targetLostPP ?
            target.stats.pp.current = target.stats.pp.current - value.targetLostPP :
            target.stats.pp.current = 0 
        }
        break;
      case 'skuld':
        value = skuldClain(favor.level!, Caller, Target)

        if (value && value.spentPP <= caller.stats.pp.current) {
          caller.stats.pp.current = caller.stats.pp.current - value.spentPP
          caller.stats.pp.update = -value.spentPP

          target.stats.pp.current > value.targetLostPP ?
            target.stats.pp.current = target.stats.pp.current - value.targetLostPP :
            target.stats.pp.current = 0 
        }
        break;
      case 'freyr':
        value = freyrGift(favor.level!, Caller, Target)

        if (value && value.spentPP <= caller.stats.pp.current) {
          caller.stats.pp.current = caller.stats.pp.current - value.spentPP
          caller.stats.pp.update = value.PPToGift - value.spentPP 

          caller.stats.pp.current = caller.stats.pp.current + value.PPToGift 
        }
        break;
      case 'skadi':
        value = skadiHunt(favor.level!, Caller, Target)

        if (value && value.spentPP <= caller.stats.pp.current) {
          caller.stats.pp.current = caller.stats.pp.current - value.spentPP
          caller.stats.pp.update = -value.spentPP 

          caller.lockRes = lockingRes(Caller)
          caller.lockRes!.arrow += value.arrowToAdd
          caller.bonus = value.bonus
        }
        break;
      case 'mimir':
        value = mimirWisdom(favor.level!, Caller, Target)

        if (value && value.spentPP <= caller.stats.pp.current) {
          caller.stats.pp.current = caller.stats.pp.current - value.spentPP
          caller.stats.pp.update = value.ppToAdd - value.spentPP 

          caller.stats.pp.current = caller.stats.pp.current + value.ppToAdd 
        }
        break;
      case 'bragi':
        value = bragiVerve(favor.level!, Caller, Target)

        if (value && value.spentPP <= caller.stats.pp.current) {
          caller.stats.pp.current = caller.stats.pp.current - value.spentPP
          caller.stats.pp.update = value.ppToAdd - value.spentPP 

          caller.stats.pp.current = caller.stats.pp.current + value.ppToAdd 
        }
        break;
      case 'vidar':
        value = vidarMight(favor.level!, Target)

        if (value && value.spentPP <= caller.stats.pp.current) {
          caller.stats.pp.current = caller.stats.pp.current - value.spentPP
          caller.stats.pp.update = -value.spentPP 

          target.lockRes = value.newTargetLockRes
          target.bonus = value.bonus
        }
        break;
      case 'brunhild':
        value = brunhildFury(favor.level!, Caller)

        if (value && value.spentPP <= caller.stats.pp.current) {
          caller.stats.pp.current = caller.stats.pp.current - value.spentPP
          caller.stats.pp.update = -value.spentPP 

          caller.lockRes = value.newTargetLockRes
          caller.bonus = value.bonus
        }
        break;
      case 'baldr':
        value = baldrInvulnerability(favor.level!, Caller)

        if (value && value.spentPP <= caller.stats.pp.current) {
          caller.stats.pp.current = caller.stats.pp.current - value.spentPP
          caller.stats.pp.update = -value.spentPP 

          caller.lockRes = value.newTargetLockRes
          caller.bonus = value.bonus
        }
        break;
      case 'ullr':
        value = ullrAim(favor.level!, Target)

        if (value && value.spentPP <= caller.stats.pp.current) {
          caller.stats.pp.current = caller.stats.pp.current - value.spentPP
          caller.stats.pp.update = -value.spentPP 

          target.lockRes = value.newTargetLockRes
          target.bonus = value.bonus
        }
        break;
      case 'heimdall':
        value = heimdallWatch(favor.level!, Caller, Target)

        if (value && value.spentPP <= caller.stats.pp.current) {
          caller.stats.pp.current = caller.stats.pp.current - value.spentPP
          caller.stats.pp.update = -value.spentPP 

          caller.stats.pv.current += value.pvtoHeal
          caller.stats.pv.update = value.pvtoHeal
        }
        break;
      case 'hel':
        value = helGrip(favor.level!, Caller, Target)

        if (value && value.spentPP <= caller.stats.pp.current) {
          caller.stats.pp.current = caller.stats.pp.current - value.spentPP
          caller.stats.pp.update = -value.spentPP 

          caller.stats.pv.current += value.pvtoHeal
          caller.stats.pv.update = value.pvtoHeal
        }
        break;
      default:
        break;
    }
  }

  return {
    player: caller,
    opponent: target
  }
}

export function favorTwoApplication(Caller: Player, Target: Player) {
  let favor = Caller.selectedFavor!
  let caller:Player = {...Caller}
  let target:Player = {...Target}

  if (!favor === undefined || favor.priority < 5) {
    switch (favor.name) {
      case 'thor':
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
        value = odinSacrifice(favor.level!, favor.sacrifice!)

        if (value && value.spentPP <= caller.stats.pp.current) {
          caller.stats.pp.current = caller.stats.pp.current - value.spentPP + value.ppToAdd
          caller.stats.pp.update = -value.spentPP + value.ppToAdd
          caller.stats.pv.current = caller.stats.pv.current - value.pvSacrified
          caller.stats.pv.update = -value.pvSacrified 
        }
        break;
      case 'idunn':
        value = idunnRejuvenation(favor.level!)

        if (value && value.spentPP <= caller.stats.pp.current) {
          caller.stats.pp.current = caller.stats.pp.current - value.spentPP
          caller.stats.pp.update = -value.spentPP
          caller.stats.pv.current = caller.stats.pv.current - value.pvToHeal
          caller.stats.pv.update = +value.pvToHeal
        }
        break;

        value = helGrip(favor.level!, Caller, Target)

        if (value && value.spentPP <= caller.stats.pp.current) {
          caller.stats.pp.current = caller.stats.pp.current - value.spentPP
          caller.stats.pp.update = -value.spentPP 

          caller.stats.pv.current += value.pvtoHeal
          caller.stats.pv.update = value.pvtoHeal
        }
        break;
      default:
        break;
    }
  }

  return {
    player: caller,
    opponent: target
  }
}

export function sortResultDices(face:Face, second:boolean) {
  let n = 0
  if (second) {
    switch (face) {
      case Face.axe:
        n=3
        break;
      case Face.hand:
        n=8
        break;
      case Face.helmet:
        n=1
        break;
      case Face.bow:
        n=4
        break;
      case Face.shield:
        n=2
        break;
      default:
        break;
    }    
  } else {
    switch (face) {
      case Face.axe:
        n=1
        break;
      case Face.hand:
        n=8
        break;
      case Face.helmet:
        n=3
        break;
      case Face.bow:
        n=2
        break;
      case Face.shield:
        n=4
        break;
      default:
        break;
    }
  }
return n
}