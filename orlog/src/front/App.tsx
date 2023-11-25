import { Favor, GameStates, Gods} from "../types"
import { CreatePlayerForm } from "./PAGES/CreatePlayerForm"
import { Game } from "./PAGES/Game"
import { useGame } from "./hooks/useGame"



export const FavorTest:Favor = {
  level: null,
  name: Gods.none,
  priority: 0,
  cost: undefined,
  description: "no favors."
}

function App() {
  const {state} = useGame()
  return (
    <>
      {state === GameStates.LOBBY && <CreatePlayerForm />}
      {(state === GameStates.TURN || state === GameStates.RESOLUTION) && <Game />}
    </>
  )
}

export default App