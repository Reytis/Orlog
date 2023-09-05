import {describe, it, expect} from 'vitest'
import {baldrInvulnerability, bragiVerve, brunhildFury, freyjaPlenty, freyrGift, friggSight, heimdallWatch, helGrip, idunnRejuvenation, lokiTrick, mimirWisdom, odinSacrifice, skadiHunt, skuldClain, thorStrike, thrymrTheft, tyrPledge, ullrAim, varBond, vidarMight} from '../src/func/favors'
import { Face, Gods, Player } from '../src/types'



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

    it('should ban a amount of dice and the cost of usage for Loki\'s Trick', () => {
        const testDices = [
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
            },
        ]
        const oldDices = [...testDices]
        let returned = lokiTrick(3, testDices)

        expect(
            returned.spentPP === 9 &&
            oldDices.sort((a, b) => {
                const nameA = a.face.toUpperCase()
                const nameB = b.face.toUpperCase()
                if (nameA < nameB) {
                  return -1
                }
                if (nameA > nameB) {
                  return 1
                }
                return 0
              }).join() === 
            [...returned.diceToBan, ...returned.newDices].sort((a, b) => {
                const nameA = a.face.toUpperCase()
                const nameB = b.face.toUpperCase()
                if (nameA < nameB) {
                  return -1
                }
                if (nameA > nameB) {
                  return 1
                }
                return 0
            }).join()
        ).toBe(true)
        expect(returned.diceToBan).toHaveLength(3)
        expect(returned.newDices).toHaveLength(3)
    })

    it('should roll aditional dices for the round and the cost of usage for Freyja\'s Plenty', () => {
        let returned = freyjaPlenty(3)
        expect(returned.spentPP === 6).toBe(true)
        expect(returned.additionalDices).toHaveLength(3)
    })

    it('should reroll dices for the round and the cost of usage for Frigg\'s Sight', () => {
        const testDices = [
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
            },
        ]
        let returned = friggSight(3, testDices)

        expect(returned.spentPP === 6).toBe(true)
        expect(returned.rerolledDices.join() != testDices.join()).toBe(false)
    })
    
    it('should sacrifice health of a player and returned number of lost pp by the oppenant for Tyr\'s Pledge', () => {
        let returned = tyrPledge(2, 3)
        expect(returned.spentPP === 6 && returned.targetLostPP === 9).toBe(true)
    })

    it('should returne the amount of pp spent to invoke this favor and the amount of damage dealt to the opponent for Thor\'s strike', () => {
        let returned = thorStrike(2)
        expect(returned.spentPP === 8 && returned.dmgToDeal === 5).toBe(true)
    })

    it('should sacrifice health of a player and returned number of gained pp by the player for Odin Sacrifice', () => {
        let returned = odinSacrifice(2, 3)
        expect(returned.spentPP === 8 && returned.ppToAdd === 12 && returned.pvSacrified === 3).toBe(true)
    })

    it('should returne the amount of pp spent to invoke this favor and the amount of pv healt to the player for Idunn Rejuvenation', () => {
        let returned = idunnRejuvenation(2)
        expect(returned.spentPP === 7 && returned.pvToHeal === 4).toBe(true)
    })

    it('should return the amount of pp destroy to the opponent based on arrow face ocuracy for Skuld\'s Claim', () => {
        const Target:Player = {
            id: '1',
            name: 'name',
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
                },
            ],
            stats: {
                pv: {current: 15, update: 0},
                pp: {current: 15, update: 0}
            },
            isReady: true,
            count: 0
        }
        const Caller:Player = {
            id: '1',
            name: 'name',
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
                },
            ],
            stats: {
                pv: {current: 15, update: 0},
                pp: {current: 15, update: 0}
            },
            isReady: true,
            count: 0
        }
        let returned = skuldClain(2, Caller, Target)

        expect(returned.spentPP === 6 && returned.targetLostPP === 6).toBe(true)
    })

    it('should return the amount of pp to add to the player based on wichever face is in majority for Freyr\'s Gift', () => {
        const Target:Player = {
            id: '1',
            name: 'name',
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
                },
            ],
            stats: {
                pv: {current: 15, update: 0},
                pp: {current: 15, update: 0}
            },
            isReady: true,
            count: 0
        }
        const Caller:Player = {
            id: '1',
            name: 'name',
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
                    face: Face.axe,
                    selected: true
                },
                {
                    pp: false,
                    face: Face.bow,
                    selected: true
                },
            ],
            stats: {
                pv: {current: 15, update: 0},
                pp: {current: 15, update: 0}
            },
            isReady: true,
            count: 0
        }
        let returned = freyrGift(2, Caller, Target)

        expect(returned.spentPP === 6 && returned.PPToGift === 15).toBe(true)
    })

    it('should return the amount of arrow to add based on the number of dice that rolled arrow for Skadi\'s Hunt', () => {
        const Target:Player = {
            id: '1',
            name: 'name',
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
                },
            ],
            stats: {
                pv: {current: 15, update: 0},
                pp: {current: 15, update: 0}
            },
            isReady: true,
            count: 0
        }
        const Caller:Player = {
            id: '1',
            name: 'name',
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
                },
            ],
            stats: {
                pv: {current: 15, update: 0},
                pp: {current: 15, update: 0}
            },
            isReady: true,
            count: 0
        }
        let returned = skadiHunt(2, Caller, Target)

        expect(returned.spentPP === 10 && returned.arrowToAdd === 4).toBe(true)
    })

    it('should returned gained pp for each damage dealt to the player this round for Mimir\'s Wisdom', () => {
        const Target:Player = {
            id: '1',
            name: 'name',
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
                },
            ],
            stats: {
                pv: {current: 15, update: 0},
                pp: {current: 15, update: 0}
            },
            isReady: true,
            count: 0
        }
        const Caller:Player = {
            id: '1',
            name: 'name',
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
                },
            ],
            stats: {
                pv: {current: 15, update: 0},
                pp: {current: 15, update: 0}
            },
            isReady: true,
            count: 0
        }
        let returned = mimirWisdom(2, Caller, Target)

        expect(returned.spentPP === 5 && returned.ppToAdd === 2).toBe(true)
    })

    it('should returned gained pp for each die that rolled hand this round for Bragi\'s Verve', () => {
        const Target:Player = {
            id: '1',
            name: 'name',
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
                },
            ],
            stats: {
                pv: {current: 15, update: 0},
                pp: {current: 15, update: 0}
            },
            isReady: true,
            count: 0
        }
        const Caller:Player = {
            id: '1',
            name: 'name',
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
                    face: Face.hand,
                    selected: true
                },
                {
                    pp: false,
                    face: Face.bow,
                    selected: true
                },
            ],
            stats: {
                pv: {current: 15, update: 0},
                pp: {current: 15, update: 0}
            },
            isReady: true,
            count: 0
        }
        let returned = bragiVerve(3, Caller, Target)

        expect(returned.spentPP === 12 && returned.ppToAdd === 4).toBe(true)
    })

    it('should return new lockres of a player and remove an amount of helmet based on level for Vidar\'s Might', () => {
        const Target:Player = {
            id: '1',
            name: 'name',
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
                },
            ],
            stats: {
                pv: {current: 15, update: 0},
                pp: {current: 15, update: 0}
            },
            isReady: true,
            count: 0
        }

        let returned = vidarMight(3, Target) 

        expect(returned.spentPP === 6 && returned.newTargetLockRes!.helmet === 0).toBe(true)
    })

    it('should return new lockres of a player and add an amount of axe based on level for Brunhild\'s Fury', () => {
        const Target:Player = {
            id: '1',
            name: 'name',
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
                },
            ],
            stats: {
                pv: {current: 15, update: 0},
                pp: {current: 15, update: 0}
            },
            isReady: true,
            count: 0
        }

        let returned = brunhildFury(3, Target) 

        expect(returned.spentPP === 18 && returned.newTargetLockRes!.axe === 6).toBe(true)
    })

    it('should add helmet for each die that rolled helmet and same for shield for Baldr\'s Invulnerability', () => {
        const Target:Player = {
            id: '1',
            name: 'name',
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
                },
            ],
            stats: {
                pv: {current: 15, update: 0},
                pp: {current: 15, update: 0}
            },
            isReady: true,
            count: 0
        }

        let returned = baldrInvulnerability(3, Target) 
        expect(returned.spentPP === 9 && returned.newTargetLockRes!.helmet === 4 && returned.newTargetLockRes!.shield === 8).toBe(true)
    })

    it('should return new lockres of a player and remove an amount of shield based on level for Ullr\'s Aim', () => {
        const Target:Player = {
            id: '1',
            name: 'name',
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
                },
            ],
            stats: {
                pv: {current: 15, update: 0},
                pp: {current: 15, update: 0}
            },
            isReady: true,
            count: 0
        }

        let returned = ullrAim(1, Target) 

        expect(returned.spentPP === 2 && returned.newTargetLockRes!.shield === 0).toBe(true)
    })

    it('should return an amount of Pv to heal based on level and the amount of damage blocked this round for Heimdall\'s Watch', () => {
        const Target:Player = {
            id: '1',
            name: 'name',
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
                },
            ],
            stats: {
                pv: {current: 15, update: 0},
                pp: {current: 15, update: 0}
            },
            isReady: true,
            count: 0
        }
        const Caller:Player = {
            id: '1',
            name: 'name',
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
                    face: Face.hand,
                    selected: true
                },
                {
                    pp: false,
                    face: Face.bow,
                    selected: true
                },
            ],
            stats: {
                pv: {current: 15, update: 0},
                pp: {current: 15, update: 0}
            },
            isReady: true,
            count: 0
        }
        let returned = heimdallWatch(3, Caller, Target)

        expect(returned.spentPP === 10 && returned.pvtoHeal === 6).toBe(true)
    })

    it('should return an amount of Pv to heal based on level and the amount of damage dealt by axe this round for Hel\'s Grip', () => {
        const Target:Player = {
            id: '1',
            name: 'name',
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
                },
            ],
            stats: {
                pv: {current: 15, update: 0},
                pp: {current: 15, update: 0}
            },
            isReady: true,
            count: 0
        }
        const Caller:Player = {
            id: '1',
            name: 'name',
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
                    face: Face.hand,
                    selected: true
                },
                {
                    pp: false,
                    face: Face.bow,
                    selected: true
                },
            ],
            stats: {
                pv: {current: 15, update: 0},
                pp: {current: 15, update: 0}
            },
            isReady: true,
            count: 0
        }
        let returned = helGrip(3, Caller, Target)

        expect(returned.spentPP === 18 && returned.pvtoHeal === 3).toBe(true)
    })
})