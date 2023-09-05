import { Dice, Favor, Player } from "../types";
import { axeDamageDealt, damageBlock, damageDealt, lockingRes, throwDice } from "./gameFunc";

export function thrymrTheft(level: number, targetFavor: Favor) {
    let PPcost = 0
    let newTargetFavor = targetFavor
    switch (level) {
        case 1:
            PPcost = 3
            newTargetFavor.level! <= 1 ? newTargetFavor.level = 0 : newTargetFavor.level = targetFavor.level! - 1
            break;
        case 2:
            PPcost = 6
            newTargetFavor.level! <= 2 ? newTargetFavor.level = 0 : newTargetFavor.level = targetFavor.level! - 2
            break;
        case 3:
            PPcost = 9
            newTargetFavor.level! = 0
            break;
        default:
            break;
    }

    return {
        spentPP: PPcost,
        newTargetFavor: newTargetFavor
    }
}

export function varBond(level: number, targetFavor: Favor) {
    let PPcost = 0
    let health = 0
    switch (level) {
        case 1:
            PPcost = 10
            health = targetFavor.cost![targetFavor.level! - 1]
            break;
        case 2:
            PPcost = 14
            health = targetFavor.cost![targetFavor.level! - 1] * 2
            break;
        case 3:
            PPcost = 18
            health = targetFavor.cost![targetFavor.level! - 1] * 3
            break;
        default:
            break;
    }

    return {
        spentPP: PPcost,
        healPV: health
    }
}

export function lokiTrick(level:number, targetDices: Dice[]) {
    let spentPP = 0
    let bannedDice:Dice[] = []
    let dices = targetDices

    switch (level) {
        case 1:
            spentPP = 3
            let dice = dices.indexOf(dices[Math.floor(Math.random() * dices.length)])
            bannedDice.push(dices[dice])
            dices.splice(dice, 1)
            break;
        case 2:
            spentPP = 6
            for (let i = 0; i < 2; i++) {
                let dice = dices.indexOf(dices[Math.floor(Math.random() * dices.length)])
                bannedDice.push(dices[dice])
                dices.splice(dice, 1)
            }
            break;
        case 3:
            spentPP = 9
            for (let i = 0; i < 3; i++) {
                let dice = dices.indexOf(dices[Math.floor(Math.random() * dices.length)])
                bannedDice.push(dices[dice])
                dices.splice(dice, 1)
            }
            break;
        default:
            break;
    }
    return {
        spentPP: spentPP,
        diceToBan: bannedDice,
        newDices: dices
    }
}

export function freyjaPlenty(level:number) {
    let spentPP = 0
    let addDice:Dice[] = []

    switch (level) {
        case 1:
            spentPP = 2
            addDice.push(throwDice())
            break;
        case 2:
            spentPP = 4
            for (let i = 0; i < 2; i++) {
                addDice.push(throwDice())              
            }
            break;
        case 3:
            spentPP = 6
            for (let i = 0; i < 3; i++) {
                addDice.push(throwDice())              
            }
            break;
        default:
            break;
    }
    return {
        spentPP: spentPP,
        additionalDices: addDice
    }
}

export function friggSight(level:number, playerDice: Dice[]) {
    let spentPP = 0
    let rerolledDice = playerDice
    let rerolled:number[] = []
    let turn = 0

    switch (level) {
        case 1:
            spentPP = 2
            let dice = rerolledDice.indexOf(rerolledDice[Math.floor(Math.random() * rerolledDice.length)])
            rerolledDice.map(d => rerolledDice.indexOf(d) === dice ? d = throwDice() : d)
            break;
        case 2:
            spentPP = 4
            while (turn < 2) {
                let dice = rerolledDice.indexOf(rerolledDice[Math.floor(Math.random() * rerolledDice.length)])
                if (!rerolled.includes(dice)) {
                    rerolledDice.map(d => rerolledDice.indexOf(d) === dice ? d = throwDice() : d) 
                    turn++
                }
            }
            turn = 0
            break;
        case 3:
            spentPP = 6
            while (turn < 3) {
                let dice = rerolledDice.indexOf(rerolledDice[Math.floor(Math.random() * rerolledDice.length)])
                if (!rerolled.includes(dice)) {
                    rerolledDice.map(d => rerolledDice.indexOf(d) === dice ? d = throwDice() : d) 
                    turn++
                }
            }
            turn = 0
            break;
        default:
            break;
    }
    return {
        spentPP: spentPP,
        rerolledDices: rerolledDice
    }
}

export function tyrPledge(level:number, healthSacrified:number) {
    let spentPP = 0
    let targetLostPP = 0
    switch (level) {
        case 1:
            spentPP = 4
            targetLostPP = 2*healthSacrified
            break;
        case 2:
            spentPP = 6
            targetLostPP = 3*healthSacrified
            break;
        case 3:
            spentPP =8
            targetLostPP = 4*healthSacrified
            break;
        default:
            break;
    }

    return {
        spentPP: spentPP,
        targetLostPP: targetLostPP
    }
}

export function skuldClain(level:number, playerDice:Player, targetDices:Player) {
    let spentPP = 0
    let targetLostPP = 0

    let player = lockingRes(playerDice)
    let target = lockingRes(targetDices)

    switch (level) {
        case 1:
            spentPP = 4
            targetLostPP = (player!.arrow + target!.arrow) * 2
            break;
        case 2:
            spentPP = 6
            targetLostPP = (player!.arrow + target!.arrow) * 3
            break;
        case 3:
            spentPP = 8
            targetLostPP = (player!.arrow + target!.arrow) * 4
            break;
        default:
            break;
    }


    return {
        spentPP: spentPP,
        targetLostPP: targetLostPP
    }
}

export function freyrGift(level:number, playerDice:Player, targetDices:Player) {
    let spentPP = 0
    let PPToGift = 0

    let player = lockingRes(playerDice)
    let target = lockingRes(targetDices)
    let total:Record<string, number> = {
        arrow: player!.arrow + target!.arrow,
        axe: player!.axe + target!.axe,
        hand: player!.hand + target!.hand,
        shield: player!.shield + target!.shield,
        helmet: player!.helmet + target!.helmet,
    }

    let max = -Infinity
    let maxKey = ""

    for (const key in total) {
        if (total[key] > max) {
            max = total[key]
            maxKey = key
        }
    }
    

    switch (level) {
        case 1:
            spentPP = 4
            PPToGift = total[maxKey] * 2
            break;
        case 2:
            spentPP = 6
            PPToGift = total[maxKey] * 3
            break;
        case 3:
            spentPP = 8
            PPToGift = total[maxKey] * 4
            break;
        default:
            break;
    }


    return {
        spentPP: spentPP,
        PPToGift: PPToGift
    }
}

export function skadiHunt(level:number, playerDice:Player, targetDices:Player) {
    let spentPP = 0
    let arrowToAdd = 0

    let player = lockingRes(playerDice)
    let target = lockingRes(targetDices)

    let arrow = player!.arrow + target!.arrow

    switch (level) {
        case 1:
            spentPP = 6
            arrowToAdd = arrow
            break;
        case 2:
            spentPP = 10
            arrowToAdd = arrow * 2
            break;
        case 3:
            spentPP = 14
            arrowToAdd = arrow * 3
            break;
        default:
            break;
    }


    return {
        spentPP: spentPP,
        arrowToAdd: arrowToAdd
    }
}

export function mimirWisdom(level:number, player:Player, target:Player) {
    let spentPP = 0
    let PPToAdd = 0

    switch (level) {
        case 1:
            spentPP = 3
            PPToAdd = damageDealt(lockingRes(player), lockingRes(target))
            break;
        case 2:
            spentPP = 5
            PPToAdd = damageDealt(lockingRes(player), lockingRes(target)) * 2
            break;
        case 3:
            spentPP = 7
            PPToAdd = damageDealt(lockingRes(player), lockingRes(target)) * 3   
            break;   
        default:
            break;
    }
    
    return {
        spentPP: spentPP,
        ppToAdd: PPToAdd
    }
}

export function bragiVerve(level:number, player:Player, target:Player) {
    let spentPP = 0
    let PPToAdd = 0

    switch (level) {
        case 1:
            spentPP = 4
            PPToAdd = (lockingRes(player)!.hand + lockingRes(target)!.hand) * 2
            break;
        case 2:
            spentPP = 8
            PPToAdd = (lockingRes(player)!.hand + lockingRes(target)!.hand) * 3
            break;
        case 3:
            spentPP = 12
            PPToAdd = (lockingRes(player)!.hand + lockingRes(target)!.hand) * 4  
            break;   
        default:
            break;
    }
    
    return {
        spentPP: spentPP,
        ppToAdd: PPToAdd
    }
}

export function vidarMight(level:number, targetRes:Player) {
    let spentPP = 0
    let newRes:Player['lockRes'] = lockingRes(targetRes)

    switch (level) {
        case 1:
            spentPP = 2
            newRes!.helmet - 2 <= 0 ? newRes!.helmet = 0 : newRes!.helmet = newRes!.helmet - 2
            break;
        case 2:
            spentPP = 4
            newRes!.helmet - 4 <= 0 ? newRes!.helmet = 0 : newRes!.helmet = newRes!.helmet - 4
            break;
        case 3:
            spentPP = 6
            newRes!.helmet - 6 <= 0 ? newRes!.helmet = 0 : newRes!.helmet = newRes!.helmet - 6
            break;   
        default:
            break;
    }
    
    return {
        spentPP: spentPP,
        newTargetLockRes: newRes
    }
}

export function brunhildFury(level:number, targetRes:Player) {
    let spentPP = 0
    let newRes:Player['lockRes'] = lockingRes(targetRes)

    switch (level) {
        case 1:
            spentPP = 6
            newRes!.axe = Math.ceil(newRes!.axe * 1.5) 
            break;
        case 2:
            spentPP = 10
            newRes!.axe = Math.ceil(newRes!.axe * 2)
            break;
        case 3:
            spentPP = 18
            newRes!.axe = Math.ceil(newRes!.axe * 3)
            break;   
        default:
            break;
    }
    
    return {
        spentPP: spentPP,
        newTargetLockRes: newRes
    }
}

export function baldrInvulnerability(level:number, targetRes:Player) {
    let spentPP = 0
    let newRes:Player['lockRes'] = lockingRes(targetRes)

    switch (level) {
        case 1:
            spentPP = 3
            newRes!.helmet = newRes!.helmet * 2
            newRes!.shield = newRes!.shield * 2
            break;
        case 2:
            spentPP = 6
            newRes!.helmet = newRes!.helmet * 3
            newRes!.shield = newRes!.shield * 3
            break;
        case 3:
            spentPP = 9
            newRes!.helmet = newRes!.helmet * 4
            newRes!.shield = newRes!.shield * 4
            break;   
        default:
            break;
    }
    
    return {
        spentPP: spentPP,
        newTargetLockRes: newRes
    }
}

export function ullrAim(level:number, targetRes:Player) {
    let spentPP = 0
    let newRes:Player['lockRes'] = lockingRes(targetRes)

    switch (level) {
        case 1:
            spentPP = 2
            newRes!.shield - 2 <= 0 ? newRes!.shield = 0 : newRes!.shield = newRes!.shield - 2
            break;
        case 2:
            spentPP = 4
            newRes!.shield - 4 <= 0 ? newRes!.shield = 0 : newRes!.shield = newRes!.shield - 3
            break;
        case 3:
            spentPP = 6
            newRes!.shield - 6 <= 0 ? newRes!.shield = 0 : newRes!.shield = newRes!.shield - 6
            break;   
        default:
            break;
    }
    
    return {
        spentPP: spentPP,
        newTargetLockRes: newRes
    }
}

export function heimdallWatch(level:number, target:Player, caller:Player) {
    let spentPP = 0
    let pvToHeal = 0
    let dmgBlock = damageBlock(lockingRes(caller), lockingRes(target))

    switch (level) {
        case 1:
            spentPP = 4
            pvToHeal = dmgBlock
            break;
        case 2:
            spentPP = 7
            pvToHeal = dmgBlock * 2
            break;
        case 3:
            spentPP = 10
            pvToHeal = dmgBlock * 3
            break;
        default:
            break;
    }

    return {
        spentPP: spentPP,
        pvtoHeal: pvToHeal
    }
}

export function helGrip(level:number, target:Player, caller:Player) {
    let spentPP = 0
    let pvToHeal = 0
    let axeDmgDealt = axeDamageDealt(lockingRes(target), lockingRes(caller))

    switch (level) {
        case 1:
            spentPP = 6
            pvToHeal = axeDmgDealt
            break;
        case 2:
            spentPP = 12
            pvToHeal = axeDmgDealt * 2
            break;
        case 3:
            spentPP = 18
            pvToHeal = axeDmgDealt * 3
            break;
        default:
            break;
    }

    return {
        spentPP: spentPP,
        pvtoHeal: pvToHeal
    }
}

export function thorStrike(level:number) {
    let spentPP = 0
    let dmgToDeal = 0

    switch (level) {
        case 1:
            spentPP = 4
            dmgToDeal = 2
            break;
        case 2:
            spentPP = 8
            dmgToDeal = 5
            break;
        case 3:
            spentPP = 12
            dmgToDeal = 8
            break;
        default:
            break;
    }

    return {
        spentPP: spentPP,
        dmgToDeal: dmgToDeal
    }
}

export function odinSacrifice(level:number, pvSacrifice:number) {
    let spentPP = 0
    let ppToAdd = 0

    switch (level) {
        case 1:
            spentPP = 6
            ppToAdd = pvSacrifice * 3
            break;
        case 2:
            spentPP = 8
            ppToAdd = pvSacrifice * 4
            break;
        case 3:
            spentPP = 10
            ppToAdd = pvSacrifice * 5
            break;
        default:
            break;
    }

    return {
        spentPP: spentPP,
        ppToAdd: ppToAdd,
        pvSacrified: pvSacrifice
    }
}

export function idunnRejuvenation(level:number) {
    let spentPP = 0
    let pvToHeal = 0

    switch (level) {
        case 1:
            spentPP = 4
            pvToHeal = 2
            break;
        case 2:
            spentPP = 7
            pvToHeal = 4
            break;
        case 3:
            spentPP = 10
            pvToHeal = 6
            break;
        default:
            break;
    }

    return {
        spentPP: spentPP,
        pvToHeal: pvToHeal
    }
}