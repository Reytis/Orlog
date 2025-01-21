import { PropsWithChildren, createContext, useContext, useState } from "react"; // Import necessary hooks and types from React
import { GameContext, GameEvents, GameStates, subStates } from "../../types"; // Import types related to game context, events, and states
import { GameMachine } from "../../machine/gameMachine"; // Import the game state machine
import { useMachine } from "@xstate/react"; // Import the useMachine hook from XState to manage state

// Define a type for the Game Context that includes the game state, context, event sender, and an event check function
type GameContextType = {
    state: GameStates; // The current state of the game
    context: GameContext; // Additional context related to the game
    send: (event: GameEvents) => void; // Function to send events to the game machine
    can: (event: GameEvents) => boolean; // Function to check if a certain event can be triggered
    subState: subStates; // Sous-état courant, initialisé à "throw" pour le lancer de dé
    setSubState: (newState: subStates) => void; // Function to update the subState value
}

// Create a context with the specified type, initialized to an empty object
const Context = createContext<GameContextType>({} as any);

// Custom hook to use the Game context, making it easier to access the game state and functions in components
export function useGame(): GameContextType {
    return useContext(Context); // Retrieve the current context value
}

// Provider component to wrap the application and provide the Game context to its children
export function GameContextProvider({children}: PropsWithChildren) {
    const [state, send] = useMachine(GameMachine); // Use the useMachine hook to manage the game state with GameMachine
    const [subState, setSubState] = useState(subStates.throw); // sous-état initial
    
    // Return the context provider with state, context, send function, and capability check function
    return (
        <Context.Provider value={{
            state: state.value as GameStates, // Current game state as GameStates type
            context: state.context, // Current context of the state machine
            send: send, // Function to send events to the state machine
            can: (event: GameEvents) => !!GameMachine.transition(state, event).changed, // Check if the event can be triggered based on the current state
            subState: subState, // sous-état courant
            setSubState: setSubState // Function to update the subState value
        }}>
        {children} 
        </Context.Provider>
    );
}

