import { FunctionComponent, useEffect, useState } from "react";
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
    pointRes = "pointRes",
    favorOneRes = "favorOneRes",
    resultRes = "resultRes",
    favorTwoRes = "favorTwoRes",
    endResolution = "endResolution"
}


export const Game:FunctionComponent = () => {
    const [subState, setSubState] = useState(subStates.throw)
    const {context, send, state} = useGame()

    const handleStep = () => {
        let p
        switch (subState) {
            case subStates.throw:
                p = "Lancez vos dés"
                break;
            case subStates.chooseDice:
                p = "Selectionnez les dés que vous souhaitez garder"
                break;
            case subStates.chooseFavor:
                p = "Selectionnez la faveurs divines à utilisez"
                break;
            case subStates.resolution:
                p = "Phase de resolution"
                break;
            case subStates.pointRes:
                p = "Calcul des PP"
                break;
            case subStates.favorOneRes:
                p = "Utilisation de la première session de faveurs divines"
                break;
            case subStates.resultRes:
                p = "Confrontation"
                break;
            case subStates.favorTwoRes:
                p = "Utilisation de la deuxième session de faveurs divines"
                break;
            case subStates.endResolution:
                p = "Attente du prochain tour"
                break;
            default:
                break;
        }
        return p
    }
    const findFavor = (id: string): Favor | undefined => {
        const player = context.players.find((p) => p.id === id);
      
        if (player) {
          const selectedFavor = player.favor?.find((f) => f !== undefined && f.selected === true);
      
          return selectedFavor;
        }
      
        return undefined;
    }

    const delay = (ms: number | undefined) => new Promise((resolve) => setTimeout(resolve, ms))

    const handlePointRes = async () => {
        send({type: "pointRes"})
        setSubState(subStates.pointRes)
        await delay(2000)
    }
    const handleFavorOne = async () => {
        send({type: "favorOneRes"})
        setSubState(subStates.favorOneRes)
        await delay(2000)
    }
    const handleFavorTwo = async () => {
        send({type: "favorTwoRes"})
        setSubState(subStates.favorTwoRes)
        await delay(2000)
    }
    const handleResultRes = async () => {
        send({type: "resultRes"})
        setSubState(subStates.resultRes)
        await delay(2000)
    }
    
    const Resolution = async () => {
        await handlePointRes()
        await handleFavorOne()
        await handleResultRes()
        await handleFavorTwo()
        setSubState(subStates.endResolution)
    }
    const handleToResolute = () => {
        send({type: "chooseFavor", playerId:"1", selectedFavor: findFavor("1")});
        send({type: "chooseFavor", playerId:"2", selectedFavor: findFavor("2")});
        send({type: "toResolute"})
        setSubState(subStates.resolution)
    }

    const handleResolute = () => {
        send({type: "resolute"})
        setSubState(subStates.throw)
    }

    useEffect(() => {
        if (subState === subStates.resolution) {
            Resolution()
        }
    }, [subState])

    return <div className="game">
        <p className="game__infos">{handleStep()}</p>
        <PlayerComponent player={context.players.find(p => p.id === '1')!} subState={[subState, (sub) => setSubState(sub)]}/>
        {(subState === subStates.chooseFavor || subState === subStates.endResolution) && <Button CtaType="cta" onClick={subState === subStates.endResolution ? handleResolute : handleToResolute} >{state === GameStates.TURN ? "Resolution" : "Next Turn"}</Button>}
        <PlayerComponent player={context.players.find(p => p.id === '2')!} second={true} subState={[subState, (sub) => setSubState(sub)]}/>
        {state === GameStates.VICTORY && <Menu />}
    </div>
}