import { PropsWithChildren, createContext, useContext } from "react";
import { GameContext, GameEvents, GameStates } from "../../types";
import { GameMachine } from "../../machine/gameMachine";
import { useMachine } from "@xstate/react"

type GameContextType = {
    state: GameStates,
    context: GameContext,
    send: (event: GameEvents) => void,
    can: (event: GameEvents) => boolean
}

const Context = createContext<GameContextType>({} as any)

export function useGame(): GameContextType {
    return useContext(Context)
}

export function GameContextProvider({children}: PropsWithChildren) {
    const [state, send] = useMachine(GameMachine)
    return <Context.Provider value={{
        state: state.value as GameStates,
        context: state.context,
        send: send,
        can: (event: GameEvents) => !!GameMachine.transition(state, event).changed
    }}>
        {children}
    </Context.Provider>
}