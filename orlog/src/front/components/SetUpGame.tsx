import { FunctionComponent, PropsWithChildren, useState } from "react"
import { Button } from "./Buttons"
import { PlayerObject } from "../../types"


type SetUpGameProps = PropsWithChildren<{
    value: number,
    players: PlayerObject[],
    onChange: Function
}>

export const SetUpGame:FunctionComponent<SetUpGameProps> = ({value, players, onChange}) => {

    return <div className="current__players">
        <div className="current__header"><h2>JOUEURS PRÊTS</h2><span style={{color: value === 2 ? "var(--Positive)" : "var(--Negative)"}}>{value}/2</span></div>
        {players.length > 0 ? <div className="player__datas">
            <div className="player__datas_name">{players[0].name} <span className="player__datas_cross" onClick={() => onChange(players[0])}>×</span></div>
            <div className="player__datas_img">personnage: <img src={players[0].character[0]}/></div>
            <div className="player__datas_img">faveurs divines: <img src={"assets/favors/"+players[0].favors[0]+"_orlog.png"}/><img src={"assets/favors/"+players[0].favors[1]+"_orlog.png"}/><img src={"assets/favors/"+players[0].favors[2]+"_orlog.png"}/></div>    
        </div> : <div className="player__placeholder">
            <div className="placeholder"><div className="light"></div></div>
            <div className="placeholder"><div className="light"></div></div>
            <div className="placeholder"><div className="light"></div></div>
        </div>}
        {players.length > 1 ? <div className="player__datas">
            <div className="player__datas_name">{players[1].name} <span className="player__datas_cross" onClick={() => onChange(players[1])}>×</span></div>
            <div className="player__datas_img">personnage: <img src={players[1].character[0]}/></div>
            <div className="player__datas_img">faveurs divines: <img src={"assets/favors/"+players[1].favors[0]+"_orlog.png"}/><img src={"assets/favors/"+players[1].favors[1]+"_orlog.png"}/><img src={"assets/favors/"+players[1].favors[2]+"_orlog.png"}/></div>    
        </div> : <div className="player__placeholder">
            <div className="placeholder"><div className="light"></div></div>
            <div className="placeholder"><div className="light"></div></div>
            <div className="placeholder"><div className="light"></div></div>
        </div>}         
         
        <Button CtaType={"cta-primary"} onClick={() => {}} disabled={value < 2}>Commencer</Button>
    </div>
}