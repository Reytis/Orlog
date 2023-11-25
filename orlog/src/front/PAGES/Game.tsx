import { FunctionComponent, useState } from "react";
import { Button } from "./components/Buttons";
import { PlayerComponent } from "./components/PlayerData";
import { useGame } from "../hooks/useGame";
import { Favor, GameStates } from "../../types";
import { Menu } from "./components/Menu";


export enum subStates {
    throw = "throw",
    chooseDice = "chooseDice",
    chooseFavor = "chooseFavor",
    resolution = "resolution",
    endResolution = "endResolution"
}

export const Game:FunctionComponent = () => {
    const [subState, setSubState] = useState(subStates.throw)
    const {context, send, state} = useGame()

    const findFavor = (id: string): Favor | undefined => {
        const player = context.players.find((p) => p.id === id);
      
        if (player) {
          const selectedFavor = player.favor?.find((f) => f !== undefined && f.selected === true);
      
          return selectedFavor;
        }
      
        return undefined;
    };
    const handleToResolute = () => {
        send({type: "chooseFavor", playerId:"1", selectedFavor: findFavor("1")});
        send({type: "chooseFavor", playerId:"2", selectedFavor: findFavor("2")});
        send({type: "toResolute"})

        setSubState(subStates.resolution)

        setTimeout(()=>{
            send({type: "pointRes"})
        }, 1000)
        setTimeout(()=>{
            send({type: "favorOneRes"})
        }, 1000)
        setTimeout(()=>{
            send({type: "resultRes"})
        }, 1000)
        setTimeout(()=>{
            send({type: "favorTwoRes"})
            setSubState(subStates.endResolution)
        }, 1000)
    }
    const handleResolute = () => {
        send({type: "resolute"})
        setSubState(subStates.throw)
    }

    return <div className="game">
        <p className="game__infos">Lancez vos dés</p>
        <PlayerComponent player={context.players.find(p => p.id === '1')!} subState={[subState, (sub) => setSubState(sub)]}/>
        {(subState === subStates.chooseFavor || subState === subStates.endResolution) && <Button CtaType="cta" onClick={subState === subStates.endResolution ? handleResolute : handleToResolute} >{state === GameStates.TURN ? "Resolution" : "Next Turn"}</Button>}
        <PlayerComponent player={context.players.find(p => p.id === '2')!} second={true} subState={[subState, (sub) => setSubState(sub)]}/>
        {state === GameStates.VICTORY && <Menu />}
    </div>
}