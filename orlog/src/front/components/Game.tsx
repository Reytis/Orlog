import { FunctionComponent, PropsWithChildren } from "react";
import { Player } from "../../types";
import { Button } from "./Buttons";
import { PlayerComponent } from "./PlayerData";

type GameProps = PropsWithChildren<{
    players:Player[]
}>

export const Game:FunctionComponent<GameProps> = ({players}) => {

    return <div className="game">
        <p className="game__infos">Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore asperiores.</p>
        <PlayerComponent player={players[0]}/>
        <Button CtaType="cta" >Action de Jeu</Button>
        <PlayerComponent player={players[1]} second={true} />
    </div>
}