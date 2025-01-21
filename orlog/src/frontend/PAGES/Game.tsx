import { useEffect } from "react";
import { Button } from "./components/Buttons";
import { PlayerComponent } from "./components/PlayerData";
import { Favor, GameContext, GameEvents, GameStates, subStates } from "../../types";
import { Menu } from "./components/Menu";
import { getUserId } from "../../func/gameFunc";


type GameProps = {
    playerOne: string,
    playerTwo: string,
    context: GameContext,
    send: (event: GameEvents) => void,
    sendWithValidations: (event: GameEvents, player: string) => void
    state: GameStates,
    subState: subStates,
    setSubState: (state: subStates) => void,
    isOnline: boolean
}
export const Game = ({playerOne, playerTwo, context, send, state, sendWithValidations, subState, setSubState, isOnline}: GameProps) => {

    const handleStep = (subState: subStates) => {
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
          const selectedFavor = player.favor?.find((f) => f !== undefined && f!== null && f.selected === true);
      
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
        send({type: "chooseFavor", playerId:playerOne, selectedFavor: findFavor(context.players[0].id)});
        send({type: "chooseFavor", playerId:playerTwo, selectedFavor: findFavor(context.players[1].id)});
        sendWithValidations({type: "toResolute"}, getUserId())
        setSubState(subStates.resolution)
    }

    const handleResolute = () => {
        sendWithValidations({type: "resolute"}, getUserId())
        setSubState(subStates.throw)
    }

    useEffect(() => {
        if (subState === subStates.resolution) {
            Resolution()
        }
    }, [subState])

    return <div className="game">
        <p className="game__infos">{handleStep(subState)}</p>
        <PlayerComponent 
            player={context.players.find(p => p.id === playerOne)!}
            subState={[subState, (sub) => setSubState(sub)]} 
            context={context} 
            send={send} 
            state={state}
            isOnline={isOnline}        
        />
        {(subState === subStates.chooseFavor || subState === subStates.endResolution) && <Button CtaType="cta" onClick={subState === subStates.endResolution ? handleResolute : handleToResolute} >{state === GameStates.TURN ? "Resolution" : "Next Turn"}</Button>}
        <PlayerComponent 
            player={context.players.find(p => p.id === playerTwo)!}
            second={true}
            subState={[subState, (sub) => setSubState(sub)]}
            context={context} 
            send={send} 
            state={state}
            isOnline={isOnline}      
        />
        {state === GameStates.VICTORY && <Menu context={context} send={send} sendWithValidations={sendWithValidations} />}
    </div>
}