import { GameStates } from "../types"
import { CreatePlayerForm } from "./PAGES/CreatePlayerForm"
import { Game } from "./PAGES/Game"
import { useGame } from "./hooks/useGame"



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