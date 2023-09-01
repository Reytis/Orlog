import {describe, it, expect} from 'vitest'
import {thrymrTheft, varBond} from '../src/func/favors'
import { Gods } from '../src/types'

describe("each Favor effects", () => {

    it('should return the new target selectedFavor and the cost of usage for Thrymr\'s Theft', () => {
        expect(
            JSON.stringify(thrymrTheft(2, {level: 1, name: Gods.bragi, priority: 4})) ===
            JSON.stringify({spentPP: 6, newTargetFavor: {level: 0, name: Gods.bragi, priority: 4}})
        ).toBe(true)
    })
    it('should return the number of PV to heal and the cost of usage for Var\'s Bond', () => {
        expect(
            JSON.stringify(varBond(2, {level: 1, name: Gods.bragi, priority: 4, cost: [4, 8, 12]})) ===
            JSON.stringify({spentPP: 14, healPV: 8})
        ).toBe(true)
    })
})