import { describe, expect, it } from "vitest"
import { Face, Player } from "../src/types"
import { arrowDamageDealt, axeDamageDealt, damageBlock, damageDealt, helmetDamageBlock, lockingRes, shieldDamageBlock } from "../src/func/gameFunc"

let thePlayer:Player = {
    id: "1",
    name: "player",
    result: [
        {
            pp: false,
            face: Face.axe,
            selected: true
        },
        {
            pp: false,
            face: Face.axe,
            selected: true
        },
        {
            pp: false,
            face: Face.helmet,
            selected: true
        },
        {
            pp: false,
            face: Face.shield,
            selected: true
        },
        {
            pp: false,
            face: Face.shield,
            selected: true
        },
        {
            pp: false,
            face: Face.bow,
            selected: true
        }
    ],
    stats: {
      pv: {current: 15, update: 0},
      pp: {current: 0, update: 0}
    },
    isReady: true,
    count: 0
  }
let thePlayerTwo:Player = {
    id: "1",
    name: "player",
    result: [
        {
            pp: false,
            face: Face.axe,
            selected: true
        },
        {
            pp: false,
            face: Face.axe,
            selected: true
        },
        {
            pp: false,
            face: Face.helmet,
            selected: true
        },
        {
            pp: false,
            face: Face.shield,
            selected: true
        },
        {
            pp: false,
            face: Face.shield,
            selected: true
        },
        {
            pp: false,
            face: Face.bow,
            selected: true
        }
    ],
    bannedDices: [
        {
            pp: false,
            face: Face.axe,
            selected: true
        },
        {
            pp: false,
            face: Face.shield,
            selected: true
        }
    ],
    stats: {
      pv: {current: 15, update: 0},
      pp: {current: 0, update: 0}
    },
    isReady: true,
    count: 0
  }
describe("each Game Func test used to calculate the resulte comparaison", () => {

    it('Should calculate the amount of each dice face present in the result of a Player', () => {
        expect(
            JSON.stringify(lockingRes(thePlayerTwo)) === 
            JSON.stringify(
            {
                arrow: 1,
                axe: 1,
                hand: 0,
                shield: 1,
                helmet: 1,
            }
        )).toBe(true)
    })
    it('Should calculate the amount of damaged dealt to a Player', () => {
        expect(damageDealt(lockingRes(thePlayer), lockingRes(thePlayer)) === 1).toBe(true)
        expect(axeDamageDealt(lockingRes(thePlayer), lockingRes(thePlayer)) === 1).toBe(true)
        expect(arrowDamageDealt(lockingRes(thePlayer), lockingRes(thePlayer)) === 0).toBe(true)
    })
    it('Should calculate the amount of damaged blocked by a Player', () => {
        expect(damageBlock(lockingRes(thePlayer), lockingRes(thePlayer)) === 2).toBe(true)
        expect(helmetDamageBlock(lockingRes(thePlayer), lockingRes(thePlayer)) === 1).toBe(true)
        expect(shieldDamageBlock(lockingRes(thePlayer), lockingRes(thePlayer)) === 1).toBe(true)
    })
})