import { FunctionComponent, PropsWithChildren } from "react"
import { Button } from "./Buttons"
import { PlayerObject } from "../../../types"
import { useGame } from "../../hooks/useGame"
import { FavorsList } from "../CreatePlayerForm"


type SetUpGameProps = PropsWithChildren<{
    value: number,
    players: PlayerObject[],
    onChange: Function
}>

export const SetUpGame:FunctionComponent<SetUpGameProps> = ({value, players, onChange}) => {
    const {send} = useGame()
    
    const addPlayer = (n:number) => send({type: 'setUpGame',  playerId: (n+1).toString(), 
    playerName: players[n].name, 
    playerCharacter: players[n].character[0], 
    playerFavor: [
        FavorsList.find(f => f.props.favor.name === players[n].favors[0])?.props.favor,
        FavorsList.find(f => f.props.favor.name === players[n].favors[1])?.props.favor,
        FavorsList.find(f => f.props.favor.name === players[n].favors[2])?.props.favor],
    playerCount: 0,
    playerResult: [],
    playerIsReady: false,
    playerStat: {
        pv: {current: 15, update: 0},
        pp: {current: 0, update: 0}
      },
    playerDice: undefined});
    const startGame = () => send({type: 'start'})
    const handleClick = () => {
        addPlayer(0);
        addPlayer(1);
        startGame();
    }
    
        
    
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
         
        <Button CtaType={"cta-primary"} onClick={handleClick} disabled={value < 2}>Commencer</Button>
    </div>
}