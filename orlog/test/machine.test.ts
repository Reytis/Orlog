import {describe, beforeEach, it, expect} from 'vitest'
import {InterpreterFrom, interpret} from 'xstate'
import {GameMachine, GameModel, makeGame} from '../src/machine/GameMachine'
import { Face, GameStates, Gods } from '../src/types.js'

describe("machine", () => {
  let machine: InterpreterFrom<typeof GameMachine> 

  describe("SetUp & Start", () => {
    beforeEach(() => {
      machine = interpret(GameMachine).start()
    })

    it('should set a player', () => {
      expect(machine.send(GameModel.events.setUpGame('1', 'Marco', undefined, undefined, false, 0, [undefined,undefined,undefined,undefined,undefined,undefined],{pv: {current:15, update:0}, pp:{current:0, update:0}}, undefined)).changed).toBe(true)
      expect(machine.state.context.players).toHaveLength(1)
    })
    it('should not set a player twice or have more than 2 players', () => {
      expect(machine.send(GameModel.events.setUpGame('1', 'Marco', undefined, undefined, false, 0, [undefined,undefined,undefined,undefined,undefined,undefined], {pv: {current:15, update:0}, pp:{current:0, update:0}}, undefined)).changed).toBe(true)
      expect(machine.send(GameModel.events.setUpGame('1', 'Marco', undefined, undefined, false, 0, [undefined,undefined,undefined,undefined,undefined,undefined], {pv: {current:15, update:0}, pp:{current:0, update:0}}, undefined)).changed).toBe(false)
      expect(machine.send(GameModel.events.setUpGame('2', 'Reytis', undefined, undefined, false, 0, [undefined,undefined,undefined,undefined,undefined,undefined], {pv: {current:15, update:0}, pp:{current:0, update:0}}, undefined)).changed).toBe(true)
      expect(machine.send(GameModel.events.setUpGame('3', 'Porco', undefined, undefined, false, 0, [undefined,undefined,undefined,undefined,undefined,undefined], {pv: {current:15, update:0}, pp:{current:0, update:0}}, undefined)).changed).toBe(false)
    })

    it('should start only with 2 players in an set the main players an current players to the same person', () => {
      expect(machine.send(GameModel.events.setUpGame('1', 'Marco', undefined, undefined, false, 0, [undefined,undefined,undefined,undefined,undefined,undefined], {pv: {current:15, update:0}, pp:{current:0, update:0}}, undefined)).changed).toBe(true)
      expect(machine.send(GameModel.events.setUpGame('2', 'Reytis', undefined, undefined, false, 0, [undefined,undefined,undefined,undefined,undefined,undefined], {pv: {current:15, update:0}, pp:{current:0, update:0}}, undefined)).changed).toBe(true)
      expect(machine.send(GameModel.events.start()).changed).toBe(true)
      expect(machine.state.context.curentThrower != null).toBe(true)
      expect(machine.state.context.curentThrower === machine.state.context.mainPlayer).toBe(true)
      expect(machine.state.context.players.length === 2).toBe(true)
    })
    it('should not start with less than to players', () => {
      expect(machine.send(GameModel.events.setUpGame('1', 'Marco', undefined, undefined, false, 0, [undefined,undefined,undefined,undefined,undefined,undefined],{pv: {current:15, update:0}, pp:{current:0, update:0}}, undefined)).changed).toBe(true)
      expect(machine.send(GameModel.events.start()).changed).toBe(false)
    })
  })

  describe("Turn (throwing, validating, choosefavor)", () => {
    const machine = makeGame(GameStates.TURN, {
      players: [{
        id: '1',
        name: 'Marco',
        character: undefined,
        favor: [{level: null, name: Gods.baldr, priority: 3}, {level: null, name: Gods.vidar, priority: 3}, {level: null, name: Gods.var, priority: 3}],
        dices:  undefined,
        result: [
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined
        ],
        stats: {
          pv: {current:15, update:0},
          pp: {current:0, update:0}
        },
        selectedFavor: undefined,
        isReady: false,
        count: 2
      },{
        id: '2',
        name: 'Jade',
        character: undefined,
        favor: undefined,
        dices:  [
          {
            pp: true,
            face: Face.axe,
            selected: true
          },
          {
            pp: false,
            face: Face.axe,
            selected: false
          },
          {
            pp: false,
            face: Face.axe,
            selected: false
          },
          {
            pp: false,
            face: Face.axe,
            selected: false
          },
          {
            pp: true,
            face: Face.axe,
            selected: true
          },
          {
            pp: false,
            face: Face.axe,
            selected: false
          }
        ],
        result: [
          {
            pp: true,
            face: Face.axe,
            selected: true
          },
          {
            pp: false,
            face: Face.axe,
            selected: false
          },
          {
            pp: false,
            face: Face.axe,
            selected: false
          },
          {
            pp: false,
            face: Face.axe,
            selected: false
          },
          {
            pp: true,
            face: Face.axe,
            selected: true
          },
          {
            pp: false,
            face: Face.axe,
            selected: false
          }
        ],
        stats: {
          pv: {current:1, update:0},
          pp: {current:0, update:0}
        },
        selectedFavor: undefined,
        isReady: false,
        count: 3
      }],
      curentThrower: '1',
      mainPlayer: '1'
    })

    it('should throw and set dice for a player', () => {
      expect(machine.send(GameModel.events.throwDices('1')).changed).toBe(true)
      expect(machine.state.context.players.find(p => p.id === '1')!.dices != null).toBe(true)
    })

    it('should add selected dice to the result of the player an change current player if count equal to 3 select all not selected dice', () => {
      expect(machine.send(GameModel.events.selectDices('1')).changed).toBe(true)
      expect(machine.state.context.players.find(p => p.id === '1')!.count === 3).toBe(true)
      expect(machine.state.context.players.find(p => p.id === '1')!.result.find(p => p === undefined) === undefined).toBe(true)
      expect(machine.state.context.curentThrower === '2').toBe(true)
    })

    it('should select the favor set her to the player an set the player ready', () => {
      expect(machine.send(GameModel.events.chooseFavor('1', { level: 2, name: Gods.baldr, priority: 4})).changed).toBe(true)
      expect(machine.state.context.players.find(p => p.id === '1')!.isReady).toBe(true)
      expect(machine.state.context.players.find(p => p.id === '1')!.selectedFavor != undefined).toBe(true)
    })
  })

  describe("Resolution", () => {
    const machine = makeGame(GameStates.RESOLUTION, {
      players: [{
        id: '1',
        name: 'Marco',
        character: undefined,
        favor: [{level: null, name: Gods.baldr, priority: 3}, {level: null, name: Gods.vidar, priority: 3}, {level: null, name: Gods.var, priority: 3}],
        dices:  undefined,
        result: [
          {
            pp: true,
            face: Face.axe,
            selected: true
          },
          {
            pp: false,
            face: Face.axe,
            selected: false
          },
          {
            pp: false,
            face: Face.axe,
            selected: false
          },
          {
            pp: false,
            face: Face.axe,
            selected: false
          },
          {
            pp: true,
            face: Face.axe,
            selected: true
          },
          {
            pp: false,
            face: Face.axe,
            selected: false
          }
        ],
        stats: {
          pv: {current:15, update:0},
          pp: {current:20, update:0}
        },
        selectedFavor: {level: 2, name: Gods.vidar, priority: 3},
        isReady: false,
        count: 2
      },{
        id: '2',
        name: 'Jade',
        character: undefined,
        favor: undefined,
        dices:  [
          {
            pp: true,
            face: Face.axe,
            selected: true
          },
          {
            pp: false,
            face: Face.axe,
            selected: false
          },
          {
            pp: false,
            face: Face.axe,
            selected: false
          },
          {
            pp: false,
            face: Face.axe,
            selected: false
          },
          {
            pp: true,
            face: Face.axe,
            selected: true
          },
          {
            pp: false,
            face: Face.axe,
            selected: false
          }
        ],
        result: [
          {
            pp: true,
            face: Face.axe,
            selected: true
          },
          {
            pp: false,
            face: Face.axe,
            selected: false
          },
          {
            pp: false,
            face: Face.axe,
            selected: false
          },
          {
            pp: false,
            face: Face.axe,
            selected: false
          },
          {
            pp: true,
            face: Face.axe,
            selected: true
          },
          {
            pp: false,
            face: Face.axe,
            selected: false
          }
        ],
        stats: {
          pv: {current:1, update:0},
          pp: {current:0, update:0}
        },
        selectedFavor: undefined,
        isReady: false,
        count: 3
      }],
      curentThrower: '2',
      mainPlayer: '1'
    })

    it('should update the pp of each player based on their result', () => {
      expect(machine.send(GameModel.events.pointRes()).changed).toBe(true)
      expect(machine.state.context.players.find(p => p.id === '1')!.stats.pp.current).toBe(22)
    })
  })
})