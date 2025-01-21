"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetMyTurnId = exports.setMyTurnId = exports.isMyTurn = exports.getUserId = void 0;
exports.pileOuFace = pileOuFace;
exports.throwDice = throwDice;
exports.lockingRes = lockingRes;
exports.axeDamageDealt = axeDamageDealt;
exports.arrowDamageDealt = arrowDamageDealt;
exports.damageDealt = damageDealt;
exports.ppTheft = ppTheft;
exports.helmetDamageBlock = helmetDamageBlock;
exports.shieldDamageBlock = shieldDamageBlock;
exports.damageBlock = damageBlock;
exports.favorOneApplication = favorOneApplication;
exports.favorTwoApplication = favorTwoApplication;
exports.sortResultDices = sortResultDices;
exports.convertPlayerToPlayerObject = convertPlayerToPlayerObject;
const types_ts_1 = require("../types.ts");
const favors_ts_1 = require("./favors.ts");
const uuid_1 = require("uuid");
//Select Randomly the player who play first
function pileOuFace(arr) {
    return arr[Math.floor(Math.random() * arr.length)].id;
}
//Throw a dice and return all data
function throwDice() {
    const p = Math.floor(Math.random() * 2) === 1;
    const f = [types_ts_1.Face.axe, types_ts_1.Face.bow, types_ts_1.Face.hand, types_ts_1.Face.helmet, types_ts_1.Face.shield];
    return {
        pp: p,
        face: f[Math.floor(Math.random() * f.length)],
        selected: false
    };
}
// Function to calculate the locked results (lockRes) for a player based on their dice rolls and banned dice
function lockingRes(s) {
    // Initialize the resultLock object to keep track of locked dice results
    let resultLock;
    resultLock = {
        arrow: 0,
        axe: 0,
        hand: 0,
        shield: 0,
        helmet: 0,
    };
    // Combine player's dice results and any additional dices they have
    let res = s.additionalDices ? [...s.result, ...s.additionalDices] : s.result;
    // Loop through each dice result and update the corresponding resultLock value based on the dice face
    res.forEach(r => {
        switch (r.face) {
            case types_ts_1.Face.axe:
                resultLock.axe++;
                break;
            case types_ts_1.Face.helmet:
                resultLock.helmet++;
                break;
            case types_ts_1.Face.bow:
                resultLock.arrow++;
                break;
            case types_ts_1.Face.hand:
                resultLock.hand++;
                break;
            case types_ts_1.Face.shield:
                resultLock.shield++;
                break;
            default:
                break;
        }
    });
    // Initialize bannedDice to track the number of banned dice by face type
    let bannedDice = {
        arrow: 0,
        axe: 0,
        hand: 0,
        shield: 0,
        helmet: 0,
    };
    // If the player has banned dice, loop through and count the banned dice by face
    if (s.bannedDices) {
        s.bannedDices.forEach(r => {
            switch (r.face) {
                case types_ts_1.Face.axe:
                    bannedDice.axe++;
                    break;
                case types_ts_1.Face.helmet:
                    bannedDice.helmet++;
                    break;
                case types_ts_1.Face.bow:
                    bannedDice.arrow++;
                    break;
                case types_ts_1.Face.hand:
                    bannedDice.hand++;
                    break;
                case types_ts_1.Face.shield:
                    bannedDice.shield++;
                    break;
                default:
                    break;
            }
        });
    }
    // Subtract the number of banned dice from the corresponding locked result in resultLock
    resultLock.arrow = resultLock.arrow - bannedDice.arrow;
    resultLock.axe = resultLock.axe - bannedDice.axe;
    resultLock.hand = resultLock.hand - bannedDice.hand;
    resultLock.shield = resultLock.shield - bannedDice.shield;
    resultLock.helmet = resultLock.helmet - bannedDice.helmet;
    // Return the final locked result with adjustments for banned dice
    return resultLock;
}
//Calculate the amount of damage dealt to a player based on Player['lockRes']
function axeDamageDealt(receiver, dealer) {
    let damage = 0;
    damage = (dealer.axe - receiver.helmet) < 0 ? 0 : (dealer.axe - receiver.helmet);
    return damage;
} //Calcul of AXE
function arrowDamageDealt(receiver, dealer) {
    let damage = 0;
    damage = (dealer.arrow - receiver.shield) < 0 ? 0 : (dealer.arrow - receiver.shield);
    return damage;
} //Calcul of ARROW
function damageDealt(receiver, dealer) {
    return axeDamageDealt(receiver, dealer) + arrowDamageDealt(receiver, dealer);
} //Calcul of ALL 
//Calculate the amount of PP stole 
function ppTheft(receiver, dealer) {
    return dealer.hand - receiver.hand;
}
//Calculate the amount of damage blocked by the player based on Player['lockRes']
function helmetDamageBlock(receiver, dealer) {
    let damageBlock = 0;
    damageBlock = (receiver.helmet - dealer.axe) <= 0 ? receiver.helmet : receiver.helmet - (receiver.helmet - dealer.axe);
    return damageBlock;
} //Calcul of HELMET
function shieldDamageBlock(receiver, dealer) {
    let damageBlock = 0;
    damageBlock = (receiver.shield - dealer.arrow) <= 0 ? receiver.shield : receiver.shield - (receiver.shield - dealer.arrow);
    return damageBlock;
} //Calcul of SHIELD
function damageBlock(receiver, dealer) {
    return shieldDamageBlock(receiver, dealer) + helmetDamageBlock(receiver, dealer);
} //Calcul of ALL
function favorOneApplication(Caller, Target) {
    // favor is the currently selected favor of the caller
    let favor = Caller.selectedFavor;
    let caller = Object.assign({}, Caller);
    let target = Object.assign({}, Target);
    // Check if favor exists and has priority less than 5 (favors with priority < 5 are valid)
    if (!favor === undefined || favor.priority < 5) {
        let value;
        // Switch statement to handle the logic for different favor names
        switch (favor.name) {
            // If target has a selected favor, apply Thrymr's theft logic
            case 'thrymr':
                if (Target.selectedFavor) {
                    value = (0, favors_ts_1.thrymrTheft)(favor.level, Target.selectedFavor);
                }
                // Update the stats of the caller and target based on the theft result
                if (value && value.spentPP <= caller.stats.pp.current) {
                    caller.stats.pp.current = caller.stats.pp.current - value.spentPP;
                    caller.stats.pp.update = -value.spentPP;
                    target.selectedFavor = value.newTargetFavor;
                }
                break;
            // If target has a selected favor, apply Var's bond logic
            case 'var':
                if (Target.selectedFavor) {
                    value = (0, favors_ts_1.varBond)(favor.level, Target.selectedFavor);
                }
                // Update PP and HP based on the bond result
                if (value && value.spentPP <= caller.stats.pp.current) {
                    caller.stats.pp.current = caller.stats.pp.current - value.spentPP;
                    caller.stats.pp.update = -value.spentPP;
                    caller.stats.pv.current = caller.stats.pv.current + value.healPV;
                    caller.stats.pv.update = value.healPV;
                }
                break;
            // Apply Loki's trick and adjust banned dices and locked results
            case 'loki':
                value = (0, favors_ts_1.lokiTrick)(favor.level, Target.result);
                if (value && value.spentPP <= caller.stats.pp.current) {
                    caller.stats.pp.current = caller.stats.pp.current - value.spentPP;
                    caller.stats.pp.update = -value.spentPP;
                    target.bannedDices = value.diceToBan;
                    target.lockRes = lockingRes(target);
                }
                break;
            // Apply Freyja's plenty to add additional dices to the caller
            case 'freyja':
                value = (0, favors_ts_1.freyjaPlenty)(favor.level);
                if (value && value.spentPP <= caller.stats.pp.current) {
                    caller.stats.pp.current = caller.stats.pp.current - value.spentPP;
                    caller.stats.pp.update = -value.spentPP;
                    caller.additionalDices = value.additionalDices;
                    caller.lockRes = lockingRes(caller);
                }
                break;
            // Frigg's favor: Allows rerolling dice and adjusting results based on sight power
            case 'frigg':
                value = (0, favors_ts_1.friggSight)(favor.level, favor.target === 'self' ? Caller.result : Target.result);
                // Check if Frigg's sight power is available and enough PP (Power Points) are available
                if (value && value.spentPP <= caller.stats.pp.current) {
                    // Deduct the spent PP from the caller's current PP
                    caller.stats.pp.current = caller.stats.pp.current - value.spentPP;
                    caller.stats.pp.update = -value.spentPP;
                    // Update the result of either the caller or the target, based on the favor target
                    favor.target === 'self' ?
                        caller.result = value.rerolledDices :
                        target.result = value.rerolledDices;
                    // Recalculate the locked results (lockRes) for both the caller and the target
                    caller.lockRes = lockingRes(caller);
                    target.lockRes = lockingRes(target);
                }
                break;
            // Tyr's favor: Involves a pledge that costs PP and a sacrifice of health (PV), reducing target's PP
            case 'tyr':
                value = (0, favors_ts_1.tyrPledge)(favor.level, favor.sacrifice);
                // Check if the power is available, PP is sufficient, and the caller's health is enough to make the sacrifice
                if (value && value.spentPP <= caller.stats.pp.current && caller.stats.pv.current > favor.sacrifice) {
                    // Deduct the spent PP and update PP status
                    caller.stats.pp.current = caller.stats.pp.current - value.spentPP;
                    caller.stats.pp.update = -value.spentPP;
                    // Deduct the sacrificed PV (health) and update health status
                    caller.stats.pv.current = caller.stats.pv.current - favor.sacrifice;
                    caller.stats.pv.update = favor.sacrifice;
                    // Deduct the lost PP from the target, ensuring it doesn't go below zero
                    target.stats.pp.current > value.targetLostPP ?
                        target.stats.pp.current = target.stats.pp.current - value.targetLostPP :
                        target.stats.pp.current = 0;
                }
                break;
            // Skuld's favor: Drains Power Points (PP) from the target
            case 'skuld':
                value = (0, favors_ts_1.skuldClain)(favor.level, Caller, Target);
                // Check if PP is sufficient and proceed with the ability
                if (value && value.spentPP <= caller.stats.pp.current) {
                    // Deduct the spent PP from the caller
                    caller.stats.pp.current = caller.stats.pp.current - value.spentPP;
                    caller.stats.pp.update = -value.spentPP;
                    // Reduce the target's PP, ensuring it doesn't drop below zero
                    target.stats.pp.current > value.targetLostPP ?
                        target.stats.pp.current = target.stats.pp.current - value.targetLostPP :
                        target.stats.pp.current = 0;
                }
                break;
            // Freyr's favor: Transfers PP to the caller
            case 'freyr':
                value = (0, favors_ts_1.freyrGift)(favor.level, Caller, Target);
                // Check if PP is sufficient to perform the ability
                if (value && value.spentPP <= caller.stats.pp.current) {
                    // Deduct the spent PP and update the caller's PP
                    caller.stats.pp.current = caller.stats.pp.current - value.spentPP;
                    caller.stats.pp.update = value.PPToGift - value.spentPP;
                    // Add the gifted PP to the caller
                    caller.stats.pp.current = caller.stats.pp.current + value.PPToGift;
                }
                break;
            // Skadi's favor: Increases the number of arrows locked for the caller
            case 'skadi':
                value = (0, favors_ts_1.skadiHunt)(favor.level, Caller, Target);
                // Check if PP is sufficient for the ability
                if (value && value.spentPP <= caller.stats.pp.current) {
                    // Deduct the spent PP
                    caller.stats.pp.current = caller.stats.pp.current - value.spentPP;
                    caller.stats.pp.update = -value.spentPP;
                    // Recalculate the locked results and increase the number of locked arrows
                    caller.lockRes = lockingRes(Caller);
                    caller.lockRes.arrow += value.arrowToAdd;
                    caller.bonus = value.bonus;
                }
                break;
            // Mimir's favor: Grants wisdom, increasing the caller's PP
            case 'mimir':
                value = (0, favors_ts_1.mimirWisdom)(favor.level, Caller, Target);
                // Check if PP is sufficient
                if (value && value.spentPP <= caller.stats.pp.current) {
                    // Deduct spent PP and then add the additional PP gained
                    caller.stats.pp.current = caller.stats.pp.current - value.spentPP;
                    caller.stats.pp.update = value.ppToAdd - value.spentPP;
                    // Add the PP gained from Mimir's wisdom
                    caller.stats.pp.current = caller.stats.pp.current + value.ppToAdd;
                }
                break;
            // Bragi's favor: Enhances verve, boosting PP
            case 'bragi':
                value = (0, favors_ts_1.bragiVerve)(favor.level, Caller, Target);
                // Check if PP is sufficient
                if (value && value.spentPP <= caller.stats.pp.current) {
                    // Deduct spent PP and then add the additional PP gained
                    caller.stats.pp.current = caller.stats.pp.current - value.spentPP;
                    caller.stats.pp.update = value.ppToAdd - value.spentPP;
                    // Add the PP gained from Bragi's verve
                    caller.stats.pp.current = caller.stats.pp.current + value.ppToAdd;
                }
                break;
            // Vidar's favor: Increases the target's locked results and grants bonuses
            case 'vidar':
                value = (0, favors_ts_1.vidarMight)(favor.level, Target);
                // Check if PP is sufficient
                if (value && value.spentPP <= caller.stats.pp.current) {
                    // Deduct the spent PP
                    caller.stats.pp.current = caller.stats.pp.current - value.spentPP;
                    caller.stats.pp.update = -value.spentPP;
                    // Apply new locked results and bonuses to the target
                    target.lockRes = value.newTargetLockRes;
                    target.bonus = value.bonus;
                }
                break;
            // Brunhild's favor: Grants fury, adjusting the caller's locked results and bonuses
            case 'brunhild':
                value = (0, favors_ts_1.brunhildFury)(favor.level, Caller);
                // Check if PP is sufficient
                if (value && value.spentPP <= caller.stats.pp.current) {
                    // Deduct the spent PP
                    caller.stats.pp.current = caller.stats.pp.current - value.spentPP;
                    caller.stats.pp.update = -value.spentPP;
                    // Apply new locked results and bonuses to the caller
                    caller.lockRes = value.newTargetLockRes;
                    caller.bonus = value.bonus;
                }
                break;
            // Baldr's favor: Grants invulnerability, adjusting the caller's locked results and bonuses
            case 'baldr':
                value = (0, favors_ts_1.baldrInvulnerability)(favor.level, Caller);
                // Check if PP is sufficient
                if (value && value.spentPP <= caller.stats.pp.current) {
                    // Deduct the spent PP
                    caller.stats.pp.current = caller.stats.pp.current - value.spentPP;
                    caller.stats.pp.update = -value.spentPP;
                    // Apply new locked results and bonuses to the caller
                    caller.lockRes = value.newTargetLockRes;
                    caller.bonus = value.bonus;
                }
                break;
            // Ullr's favor: Enhances the target's aim, adjusting their locked results and bonuses
            case 'ullr':
                value = (0, favors_ts_1.ullrAim)(favor.level, Target);
                // Check if PP is sufficient
                if (value && value.spentPP <= caller.stats.pp.current) {
                    // Deduct the spent PP
                    caller.stats.pp.current = caller.stats.pp.current - value.spentPP;
                    caller.stats.pp.update = -value.spentPP;
                    // Apply new locked results and bonuses to the target
                    target.lockRes = value.newTargetLockRes;
                    target.bonus = value.bonus;
                }
                break;
            // Heimdall's favor: Heals the caller by restoring health (PV)
            case 'heimdall':
                value = (0, favors_ts_1.heimdallWatch)(favor.level, Caller, Target);
                // Check if PP is sufficient
                if (value && value.spentPP <= caller.stats.pp.current) {
                    // Deduct the spent PP
                    caller.stats.pp.current = caller.stats.pp.current - value.spentPP;
                    caller.stats.pp.update = -value.spentPP;
                    // Heal the caller by adding to their current health (PV)
                    caller.stats.pv.current += value.pvToHeal;
                    caller.stats.pv.update = value.pvToHeal;
                }
                break;
            // Hel's favor: Provides healing by restoring health (PV) to the caller
            case 'hel':
                value = (0, favors_ts_1.helGrip)(favor.level, Caller, Target);
                // Check if PP is sufficient
                if (value && value.spentPP <= caller.stats.pp.current) {
                    // Deduct the spent PP
                    caller.stats.pp.current = caller.stats.pp.current - value.spentPP;
                    caller.stats.pp.update = -value.spentPP;
                    // Heal the caller by adding to their current health (PV)
                    caller.stats.pv.current += value.pvToHeal;
                    caller.stats.pv.update = value.pvToHeal;
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
    };
}
function favorTwoApplication(Caller, Target) {
    let favor = Caller.selectedFavor;
    let caller = Object.assign({}, Caller);
    let target = Object.assign({}, Target);
    // Check if favor exists and has priority less than 5
    if (!favor === undefined || favor.priority < 5) {
        switch (favor.name) {
            case 'thor':
                // Apply Thor's strike logic and update the PP and HP of the target
                let value;
                value = (0, favors_ts_1.thorStrike)(favor.level);
                if (value && value.spentPP <= caller.stats.pp.current) {
                    caller.stats.pp.current = caller.stats.pp.current - value.spentPP;
                    caller.stats.pp.update = -value.spentPP;
                    target.stats.pv.current = target.stats.pv.current - value.dmgToDeal;
                    target.stats.pv.update = -value.dmgToDeal;
                }
                break;
            case 'odin':
                // Apply Odin's sacrifice logic, sacrifice health to gain PP
                value = (0, favors_ts_1.odinSacrifice)(favor.level, favor.sacrifice);
                if (value && value.spentPP <= caller.stats.pp.current) {
                    caller.stats.pp.current = caller.stats.pp.current - value.spentPP + value.ppToAdd;
                    caller.stats.pp.update = -value.spentPP + value.ppToAdd;
                    caller.stats.pv.current = caller.stats.pv.current - value.pvSacrified;
                    caller.stats.pv.update = -value.pvSacrified;
                }
                break;
            case 'idunn':
                // Apply Idunn's rejuvenation, heal caller's HP
                value = (0, favors_ts_1.idunnRejuvenation)(favor.level);
                if (value && value.spentPP <= caller.stats.pp.current) {
                    caller.stats.pp.current = caller.stats.pp.current - value.spentPP;
                    caller.stats.pp.update = -value.spentPP;
                    caller.stats.pv.current = caller.stats.pv.current - value.pvToHeal;
                    caller.stats.pv.update = +value.pvToHeal;
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
    };
}
function sortResultDices(face, second) {
    let n = 0;
    // Switch statement to assign numeric value to each dice face based on whether it's second roll
    if (second) {
        switch (face) {
            case types_ts_1.Face.axe:
                n = 3;
                break;
            case types_ts_1.Face.hand:
                n = 8;
                break;
            case types_ts_1.Face.helmet:
                n = 1;
                break;
            case types_ts_1.Face.bow:
                n = 4;
                break;
            case types_ts_1.Face.shield:
                n = 2;
                break;
            default:
                break;
        }
    }
    else {
        // First roll face values
        switch (face) {
            case types_ts_1.Face.axe:
                n = 1;
                break;
            case types_ts_1.Face.hand:
                n = 8;
                break;
            case types_ts_1.Face.helmet:
                n = 3;
                break;
            case types_ts_1.Face.bow:
                n = 2;
                break;
            case types_ts_1.Face.shield:
                n = 4;
                break;
            default:
                break;
        }
    }
    // Return the numeric value for sorting
    return n;
}
// Function to convert Player to PlayerObject
function convertPlayerToPlayerObject(player) {
    return {
        name: player.name,
        character: player.character ? [player.character] : [], // Assuming character is an optional single object, convert it to an array
        favors: player.favor || [], // Favors can be an array or empty if undefined
        position: player.id, // Set position to player's id
    };
}
// utils to create or get unique id for game session
const getUserId = () => {
    let userId = localStorage.getItem('userId');
    if (!userId) {
        userId = (0, uuid_1.v4)(); // Generate unique id
        localStorage.setItem('userId', userId);
    }
    return userId;
};
exports.getUserId = getUserId;
const isMyTurn = (id) => {
    return localStorage.getItem('myTurnId') === id;
};
exports.isMyTurn = isMyTurn;
const setMyTurnId = (id) => {
    localStorage.setItem('myTurnId', id);
};
exports.setMyTurnId = setMyTurnId;
const resetMyTurnId = (id) => {
    if ((0, exports.isMyTurn)(id)) {
        localStorage.removeItem('myTurnId');
    }
};
exports.resetMyTurnId = resetMyTurnId;
