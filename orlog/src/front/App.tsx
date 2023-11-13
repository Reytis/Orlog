import { Character, Favor, Gods, Player } from "../types"
import { CreatePlayerForm } from "./components/CreatePlayerForm"
import { Game } from "./components/Game"
import { Menu } from "./components/Menu"



let FavorTest:Favor = {
  level: null,
  name: Gods.baldr,
  priority: 4,
  cost: [3, 5, 8],
  description: "description of the favor you know something like this."
}
let PlayerTest:Player = {
  id: "1",
  name: "Test",
  character: Character.eivorHomme,
  favor: [FavorTest, FavorTest, FavorTest],
  result: [],
  stats: {
    pv: {
      current: 15,
      update: 0
    },
    pp: {
      current: 12,
      update: 0
    }
  },
  isReady: false,
  count: 0
}

function App() {
  return (
    <>
      <CreatePlayerForm />
      {/* <Menu />
      <Game players={[PlayerTest, PlayerTest]} /> */}
    </>
  )
}

export default App