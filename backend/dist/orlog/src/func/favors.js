import { Face } from "../types.js";
import { axeDamageDealt, damageBlock, damageDealt, lockingRes, throwDice } from "./gameFunc.js";
// Function to handle Thrymr's theft, which reduces the level of a target's favor
export function thrymrTheft(level, targetFavor) {
    let PPcost = 0; // Power Points cost
    let newTargetFavor = targetFavor; // Clone of the target's favor
    // Reduce target favor's level based on the favor's level
    switch (level) {
        case 1:
            PPcost = 3;
            // If target's favor level is 1 or less, set it to 0, otherwise reduce by 1
            newTargetFavor.level <= 1 ? newTargetFavor.level = 0 : newTargetFavor.level = targetFavor.level - 1;
            break;
        case 2:
            PPcost = 6;
            // If target's favor level is 2 or less, set it to 0, otherwise reduce by 2
            newTargetFavor.level <= 2 ? newTargetFavor.level = 0 : newTargetFavor.level = targetFavor.level - 2;
            break;
        case 3:
            PPcost = 9;
            // At level 3, the target's favor level is set to 0
            newTargetFavor.level = 0;
            break;
        default:
            break;
    }
    // Return the spent PP and the new target favor
    return {
        spentPP: PPcost,
        newTargetFavor: newTargetFavor
    };
}
// Function to handle Var's bond, healing the caller's health based on the favor's cost
export function varBond(level, targetFavor) {
    let PPcost = 0; // Power Points cost
    let health = 0; // Health to heal
    // Calculate health to heal based on the favor level and the target favor's cost
    switch (level) {
        case 1:
            PPcost = 10;
            health = targetFavor.cost[targetFavor.level - 1]; // Heal equal to the cost of the current favor level
            break;
        case 2:
            PPcost = 14;
            health = targetFavor.cost[targetFavor.level - 1] * 2; // Heal twice the cost
            break;
        case 3:
            PPcost = 18;
            health = targetFavor.cost[targetFavor.level - 1] * 3; // Heal three times the cost
            break;
        default:
            break;
    }
    // Return the spent PP and health to heal
    return {
        spentPP: PPcost,
        healPV: health
    };
}
// Function for Loki's trick to ban dice from the target
export function lokiTrick(level, targetDices) {
    let spentPP = 0; // Power Points cost
    let bannedDice = []; // Array to hold banned dice
    let dices = targetDices; // Clone of target's dice array
    // Based on favor level, randomly select and ban dice
    switch (level) {
        case 1:
            spentPP = 3;
            let dice = dices.indexOf(dices[Math.floor(Math.random() * dices.length)]); // Pick a random die
            bannedDice.push(dices[dice]); // Add the banned die to the array
            dices.splice(dice, 1); // Remove the die from the target's dice
            break;
        case 2:
            spentPP = 6;
            // Loop to ban 2 dice at level 2
            for (let i = 0; i < 2; i++) {
                let dice = dices.indexOf(dices[Math.floor(Math.random() * dices.length)]);
                bannedDice.push(dices[dice]);
                dices.splice(dice, 1);
            }
            break;
        case 3:
            spentPP = 9;
            // Loop to ban 3 dice at level 3
            for (let i = 0; i < 3; i++) {
                let dice = dices.indexOf(dices[Math.floor(Math.random() * dices.length)]);
                bannedDice.push(dices[dice]);
                dices.splice(dice, 1);
            }
            break;
        default:
            break;
    }
    // Return the spent PP, the banned dice, and the new dice array
    return {
        spentPP: spentPP,
        diceToBan: bannedDice,
        newDices: dices
    };
}
// Function for Freyja's favor to add additional dice
export function freyjaPlenty(level) {
    let spentPP = 0; // Power Points cost
    let addDice = []; // Array to hold added dice
    // Based on favor level, add dice
    switch (level) {
        case 1:
            spentPP = 2;
            addDice.push(throwDice()); // Add one die at level 1
            break;
        case 2:
            spentPP = 4;
            // Loop to add 2 dice at level 2
            for (let i = 0; i < 2; i++) {
                addDice.push(throwDice());
            }
            break;
        case 3:
            spentPP = 6;
            // Loop to add 3 dice at level 3
            for (let i = 0; i < 3; i++) {
                addDice.push(throwDice());
            }
            break;
        default:
            break;
    }
    // Return the spent PP and the additional dice
    return {
        spentPP: spentPP,
        additionalDices: addDice
    };
}
// Function for Frigg's sight, which allows rerolling dice
export function friggSight(level, playerDice) {
    let spentPP = 0; // Power Points cost
    let rerolledDice = playerDice; // Clone of the player's dice array
    let rerolled = []; // Track rerolled dice to avoid rerolling the same die
    let turn = 0; // Counter for the number of rerolls
    // Based on favor level, reroll dice
    switch (level) {
        case 1:
            spentPP = 2;
            let dice = rerolledDice.indexOf(rerolledDice[Math.floor(Math.random() * rerolledDice.length)]); // Pick a random die
            rerolledDice.map(d => rerolledDice.indexOf(d) === dice ? d = throwDice() : d); // Reroll the selected die
            break;
        case 2:
            spentPP = 4;
            // Loop to reroll 2 different dice at level 2
            while (turn < 2) {
                let dice = rerolledDice.indexOf(rerolledDice[Math.floor(Math.random() * rerolledDice.length)]);
                if (!rerolled.includes(dice)) {
                    rerolledDice.map(d => rerolledDice.indexOf(d) === dice ? d = throwDice() : d);
                    turn++;
                }
            }
            turn = 0; // Reset the turn counter
            break;
        case 3:
            spentPP = 6;
            // Loop to reroll 3 different dice at level 3
            while (turn < 3) {
                let dice = rerolledDice.indexOf(rerolledDice[Math.floor(Math.random() * rerolledDice.length)]);
                if (!rerolled.includes(dice)) {
                    rerolledDice.map(d => rerolledDice.indexOf(d) === dice ? d = throwDice() : d);
                    turn++;
                }
            }
            turn = 0; // Reset the turn counter
            break;
        default:
            break;
    }
    // Return the spent PP and the rerolled dice
    return {
        spentPP: spentPP,
        rerolledDices: rerolledDice
    };
}
// Function for Tyr's pledge, allowing a player to sacrifice health to cause a target to lose Power Points (PP)
export function tyrPledge(level, healthSacrified) {
    let spentPP = 0; // Power Points cost
    let targetLostPP = 0; // Target's lost Power Points
    // Calculate spent PP and target's lost PP based on the level and health sacrificed
    switch (level) {
        case 1:
            spentPP = 4;
            targetLostPP = 2 * healthSacrified; // Target loses 2 PP per health point sacrificed
            break;
        case 2:
            spentPP = 6;
            targetLostPP = 3 * healthSacrified; // Target loses 3 PP per health point sacrificed
            break;
        case 3:
            spentPP = 8;
            targetLostPP = 4 * healthSacrified; // Target loses 4 PP per health point sacrificed
            break;
        default:
            break;
    }
    // Return the spent PP and the target's lost PP
    return {
        spentPP: spentPP,
        targetLostPP: targetLostPP
    };
}
// Function for Skuld's claim, calculating the loss of Power Points for the target based on the player's arrows
export function skuldClain(level, playerDice, targetDices) {
    let spentPP = 0; // Power Points cost
    let targetLostPP = 0; // Target's lost Power Points
    // Lock the current state of the player and target dice
    let player = lockingRes(playerDice);
    let target = lockingRes(targetDices);
    // Calculate lost PP based on the combined arrows of player and target
    switch (level) {
        case 1:
            spentPP = 4;
            targetLostPP = (player.arrow + target.arrow) * 2; // Multiply arrows by 2
            break;
        case 2:
            spentPP = 6;
            targetLostPP = (player.arrow + target.arrow) * 3; // Multiply arrows by 3
            break;
        case 3:
            spentPP = 8;
            targetLostPP = (player.arrow + target.arrow) * 4; // Multiply arrows by 4
            break;
        default:
            break;
    }
    // Return the spent PP and the target's lost PP
    return {
        spentPP: spentPP,
        targetLostPP: targetLostPP
    };
}
// Function for Freyr's gift, allowing a player to gift Power Points based on the highest dice values between player and target
export function freyrGift(level, playerDice, targetDices) {
    let spentPP = 0; // Power Points cost
    let PPToGift = 0; // Power Points to gift
    // Lock the current state of the player and target dice
    let player = lockingRes(playerDice);
    let target = lockingRes(targetDices);
    // Create a total of all resources for both player and target
    let total = {
        arrow: player.arrow + target.arrow,
        axe: player.axe + target.axe,
        hand: player.hand + target.hand,
        shield: player.shield + target.shield,
        helmet: player.helmet + target.helmet,
    };
    // Determine the resource with the maximum value
    let max = -Infinity;
    let maxKey = "";
    for (const key in total) {
        if (total[key] > max) {
            max = total[key];
            maxKey = key; // Store the key with the maximum value
        }
    }
    // Calculate spent PP and Power Points to gift based on the level and maximum resource
    switch (level) {
        case 1:
            spentPP = 4;
            PPToGift = total[maxKey] * 2; // Gift double the highest resource value
            break;
        case 2:
            spentPP = 6;
            PPToGift = total[maxKey] * 3; // Gift triple the highest resource value
            break;
        case 3:
            spentPP = 8;
            PPToGift = total[maxKey] * 4; // Gift quadruple the highest resource value
            break;
        default:
            break;
    }
    // Return the spent PP and the Power Points to gift
    return {
        spentPP: spentPP,
        PPToGift: PPToGift
    };
}
// Function for Skadi's hunt, adding arrows based on the total number of arrows from the player and target
export function skadiHunt(level, playerDice, targetDices) {
    let spentPP = 0; // Power Points cost
    let arrowToAdd = 0; // Arrows to add
    let bonus = [{ type: Face.bow, num: level, multiply: true }]; // Bonus configuration
    // Lock the current state of the player and target dice
    let player = lockingRes(playerDice);
    let target = lockingRes(targetDices);
    // Calculate total arrows from both player and target
    let arrow = player.arrow + target.arrow;
    // Calculate spent PP and arrows to add based on the level
    switch (level) {
        case 1:
            spentPP = 6;
            arrowToAdd = arrow; // Add total arrows for level 1
            break;
        case 2:
            spentPP = 10;
            arrowToAdd = arrow * 2; // Double arrows for level 2
            break;
        case 3:
            spentPP = 14;
            arrowToAdd = arrow * 3; // Triple arrows for level 3
            break;
        default:
            break;
    }
    // Return the spent PP, arrows to add, and bonus information
    return {
        spentPP: spentPP,
        arrowToAdd: arrowToAdd,
        bonus: bonus
    };
}
// Function for Mimir's wisdom, calculating Power Points to add based on damage dealt
export function mimirWisdom(level, player, target) {
    let spentPP = 0; // Power Points cost
    let PPToAdd = 0; // Power Points to add
    // Calculate spent PP and Power Points to add based on the level and damage dealt
    switch (level) {
        case 1:
            spentPP = 3;
            PPToAdd = damageDealt(lockingRes(player), lockingRes(target)); // Add PP based on damage dealt
            break;
        case 2:
            spentPP = 5;
            PPToAdd = damageDealt(lockingRes(player), lockingRes(target)) * 2; // Double the damage for level 2
            break;
        case 3:
            spentPP = 7;
            PPToAdd = damageDealt(lockingRes(player), lockingRes(target)) * 3; // Triple the damage for level 3
            break;
        default:
            break;
    }
    // Return the spent PP and the Power Points to add
    return {
        spentPP: spentPP,
        ppToAdd: PPToAdd
    };
}
// Function for Bragi's Verve, allowing the addition of Power Points based on the player's and target's hand values
export function bragiVerve(level, player, target) {
    let spentPP = 0; // Power Points cost
    let PPToAdd = 0; // Power Points to add
    // Calculate spent PP and Power Points to add based on the level and hand values
    switch (level) {
        case 1:
            spentPP = 4;
            PPToAdd = (lockingRes(player).hand + lockingRes(target).hand) * 2; // Add double the combined hand values
            break;
        case 2:
            spentPP = 8;
            PPToAdd = (lockingRes(player).hand + lockingRes(target).hand) * 3; // Add triple the combined hand values
            break;
        case 3:
            spentPP = 12;
            PPToAdd = (lockingRes(player).hand + lockingRes(target).hand) * 4; // Add quadruple the combined hand values
            break;
        default:
            break;
    }
    // Return the spent PP and the Power Points to add
    return {
        spentPP: spentPP,
        ppToAdd: PPToAdd
    };
}
// Function for Vidar's Might, reducing the target's helmet resource based on the level
export function vidarMight(level, targetRes) {
    let spentPP = 0; // Power Points cost
    let newRes = lockingRes(targetRes); // Locked resources of the target
    let bonus = [{ type: Face.helmet, num: -level * 2, multiply: false }]; // Helmet reduction bonus
    // Reduce the helmet resource based on the level
    switch (level) {
        case 1:
            spentPP = 2;
            newRes.helmet - 2 <= 0 ? newRes.helmet = 0 : newRes.helmet = newRes.helmet - 2; // Decrease by 2, prevent negative
            break;
        case 2:
            spentPP = 4;
            newRes.helmet - 4 <= 0 ? newRes.helmet = 0 : newRes.helmet = newRes.helmet - 4; // Decrease by 4, prevent negative
            break;
        case 3:
            spentPP = 6;
            newRes.helmet - 6 <= 0 ? newRes.helmet = 0 : newRes.helmet = newRes.helmet - 6; // Decrease by 6, prevent negative
            break;
        default:
            break;
    }
    // Return the spent PP, new target resources, and bonus information
    return {
        spentPP: spentPP,
        newTargetLockRes: newRes,
        bonus: bonus
    };
}
// Function for Brunhild's Fury, increasing the target's axe resource based on the level
export function brunhildFury(level, targetRes) {
    let spentPP = 0; // Power Points cost
    let newRes = lockingRes(targetRes); // Locked resources of the target
    let bonus = [{ type: Face.axe, num: level === 1 ? 1.5 : level, multiply: true }]; // Axe increase bonus
    // Increase the axe resource based on the level
    switch (level) {
        case 1:
            spentPP = 6;
            newRes.axe = Math.ceil(newRes.axe * 1.5); // Increase by 50% for level 1
            break;
        case 2:
            spentPP = 10;
            newRes.axe = Math.ceil(newRes.axe * 2); // Double the axe for level 2
            break;
        case 3:
            spentPP = 18;
            newRes.axe = Math.ceil(newRes.axe * 3); // Triple the axe for level 3
            break;
        default:
            break;
    }
    // Return the spent PP, new target resources, and bonus information
    return {
        spentPP: spentPP,
        newTargetLockRes: newRes,
        bonus: bonus
    };
}
// Function for Baldr's Invulnerability, doubling the target's helmet and shield resources based on the level
export function baldrInvulnerability(level, targetRes) {
    let spentPP = 0; // Power Points cost
    let newRes = lockingRes(targetRes); // Locked resources of the target
    let bonus = [{ type: Face.shield, num: 0, multiply: true }, { type: Face.helmet, num: 0, multiply: true }]; // Shield and helmet bonus
    // Double the helmet and shield resources based on the level
    switch (level) {
        case 1:
            spentPP = 3;
            newRes.helmet = newRes.helmet * 2; // Double the helmet for level 1
            newRes.shield = newRes.shield * 2; // Double the shield for level 1
            bonus[0].num = 2; // Set bonus for shield
            bonus[1].num = 2; // Set bonus for helmet
            break;
        case 2:
            spentPP = 6;
            newRes.helmet = newRes.helmet * 3; // Triple the helmet for level 2
            newRes.shield = newRes.shield * 3; // Triple the shield for level 2
            bonus[0].num = 3; // Set bonus for shield
            bonus[1].num = 3; // Set bonus for helmet
            break;
        case 3:
            spentPP = 9;
            newRes.helmet = newRes.helmet * 4; // Quadruple the helmet for level 3
            newRes.shield = newRes.shield * 4; // Quadruple the shield for level 3
            bonus[0].num = 4; // Set bonus for shield
            bonus[1].num = 4; // Set bonus for helmet
            break;
        default:
            break;
    }
    // Return the spent PP, new target resources, and bonus information
    return {
        spentPP: spentPP,
        newTargetLockRes: newRes,
        bonus: bonus
    };
}
// Function for Ullr's Aim, reducing the target's shield resource based on the level
export function ullrAim(level, targetRes) {
    let spentPP = 0; // Power Points cost
    let newRes = lockingRes(targetRes); // Locked resources of the target
    let bonus = [{ type: Face.shield, num: 0, multiply: false }]; // Shield reduction bonus
    // Reduce the shield resource based on the level
    switch (level) {
        case 1:
            spentPP = 2;
            newRes.shield - 2 <= 0 ? newRes.shield = 0 : newRes.shield = newRes.shield - 2; // Decrease by 2, prevent negative
            bonus[0].num = -2; // Set bonus for shield
            break;
        case 2:
            spentPP = 4;
            newRes.shield - 4 <= 0 ? newRes.shield = 0 : newRes.shield = newRes.shield - 4; // Decrease by 4, prevent negative
            bonus[0].num = -3; // Set bonus for shield
            break;
        case 3:
            spentPP = 6;
            newRes.shield - 6 <= 0 ? newRes.shield = 0 : newRes.shield = newRes.shield - 6; // Decrease by 6, prevent negative
            bonus[0].num = -6; // Set bonus for shield
            break;
        default:
            break;
    }
    // Return the spent PP, new target resources, and bonus information
    return {
        spentPP: spentPP,
        newTargetLockRes: newRes,
        bonus: bonus
    };
}
// Function for Heimdall's Watch, which heals based on damage blocked
export function heimdallWatch(level, target, caller) {
    let spentPP = 0; // Power Points cost
    let pvToHeal = 0; // Points to heal
    let dmgBlock = damageBlock(lockingRes(caller), lockingRes(target)); // Calculate damage block from caller's and target's resources
    // Determine spent PP and points to heal based on the level
    switch (level) {
        case 1:
            spentPP = 4;
            pvToHeal = dmgBlock; // Heal by the amount of damage blocked
            break;
        case 2:
            spentPP = 7;
            pvToHeal = dmgBlock * 2; // Heal double the blocked damage
            break;
        case 3:
            spentPP = 10;
            pvToHeal = dmgBlock * 3; // Heal triple the blocked damage
            break;
        default:
            break;
    }
    // Return the spent PP and points to heal
    return {
        spentPP: spentPP,
        pvToHeal: pvToHeal
    };
}
// Function for Hel's Grip, which heals based on axe damage dealt
export function helGrip(level, target, caller) {
    let spentPP = 0; // Power Points cost
    let pvToHeal = 0; // Points to heal
    let axeDmgDealt = axeDamageDealt(lockingRes(target), lockingRes(caller)); // Calculate axe damage dealt
    // Determine spent PP and points to heal based on the level
    switch (level) {
        case 1:
            spentPP = 6;
            pvToHeal = axeDmgDealt; // Heal by the amount of axe damage dealt
            break;
        case 2:
            spentPP = 12;
            pvToHeal = axeDmgDealt * 2; // Heal double the axe damage dealt
            break;
        case 3:
            spentPP = 18;
            pvToHeal = axeDmgDealt * 3; // Heal triple the axe damage dealt
            break;
        default:
            break;
    }
    // Return the spent PP and points to heal
    return {
        spentPP: spentPP,
        pvToHeal: pvToHeal
    };
}
// Function for Thor's Strike, which deals a fixed amount of damage
export function thorStrike(level) {
    let spentPP = 0; // Power Points cost
    let dmgToDeal = 0; // Damage to deal
    // Determine spent PP and damage to deal based on the level
    switch (level) {
        case 1:
            spentPP = 4;
            dmgToDeal = 2; // Deal 2 damage at level 1
            break;
        case 2:
            spentPP = 8;
            dmgToDeal = 5; // Deal 5 damage at level 2
            break;
        case 3:
            spentPP = 12;
            dmgToDeal = 8; // Deal 8 damage at level 3
            break;
        default:
            break;
    }
    // Return the spent PP and damage to deal
    return {
        spentPP: spentPP,
        dmgToDeal: dmgToDeal
    };
}
// Function for Odin's Sacrifice, which adds Power Points based on a sacrifice of points
export function odinSacrifice(level, pvSacrifice) {
    let spentPP = 0; // Power Points cost
    let ppToAdd = 0; // Power Points to add
    // Determine spent PP and Power Points to add based on the level
    switch (level) {
        case 1:
            spentPP = 6;
            ppToAdd = pvSacrifice * 3; // Add triple the sacrificed points for level 1
            break;
        case 2:
            spentPP = 8;
            ppToAdd = pvSacrifice * 4; // Add quadruple the sacrificed points for level 2
            break;
        case 3:
            spentPP = 10;
            ppToAdd = pvSacrifice * 5; // Add quintuple the sacrificed points for level 3
            break;
        default:
            break;
    }
    // Return the spent PP, Power Points to add, and sacrificed points
    return {
        spentPP: spentPP,
        ppToAdd: ppToAdd,
        pvSacrified: pvSacrifice // Return the sacrificed points
    };
}
// Function for Idunn's Rejuvenation, which heals a fixed amount of points
export function idunnRejuvenation(level) {
    let spentPP = 0; // Power Points cost
    let pvToHeal = 0; // Points to heal
    // Determine spent PP and points to heal based on the level
    switch (level) {
        case 1:
            spentPP = 4;
            pvToHeal = 2; // Heal 2 points at level 1
            break;
        case 2:
            spentPP = 7;
            pvToHeal = 4; // Heal 4 points at level 2
            break;
        case 3:
            spentPP = 10;
            pvToHeal = 6; // Heal 6 points at level 3
            break;
        default:
            break;
    }
    // Return the spent PP and points to heal
    return {
        spentPP: spentPP,
        pvToHeal: pvToHeal
    };
}
