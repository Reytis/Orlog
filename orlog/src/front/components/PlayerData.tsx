import React from "react";
import { Face, Player } from "../../types";
import { PlayerStat } from "./Stats";
import { FavorUi } from "./Favor";
import { Button } from "./Buttons";
import { Dice } from "./Dice";

interface PlayerProps {
    player: Player,
    second?: boolean
}

export class PlayerComponent extends React.Component<PlayerProps> {
    bonus: number;
    
    constructor (props: PlayerProps) {
        super(props)
        this.bonus = -1
    }

    render(): React.ReactNode {
        const {stats, favor, name, character} = this.props.player 
        return <div className={this.props.second ? "player__component second__player" : "player__component"}>
            <div className="left">
                <div className="player__data">
                    <h2>{name.toUpperCase()}</h2>
                    <PlayerStat stats={stats} />
                </div>
                <div className="player__favors_bonus">
                    <Dice face={Face.axe} />
                    <p style={this.bonus < 0 ? {color:"var(--Negative)"}:{color:"var(--Positive)"}}>{this.bonus}</p>
                </div>
                <Button CtaType="cta-primary">Actions à faire</Button>
                <div className="player__favors">
                    {favor?.map(f => <FavorUi key={Math.random()} favor={f}/>)}  
                </div> 
            </div>
            <div className="right">
                <Dice face={Face.axe} />
                <Dice face={Face.bow} pp/>
                <Dice face={Face.axe} />
                <Dice face={Face.bow} pp/>
                <Dice face={Face.axe} />
                <Dice face={Face.bow} pp/>
            </div>
            <img src={"assets/"+character+".png"}  className="player__character"/>
        </div>
    }
}
