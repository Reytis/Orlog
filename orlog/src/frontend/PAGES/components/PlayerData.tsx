import { FunctionComponent, useEffect, useState } from "react";
import { GameContext, GameEvents, GameStates, Player } from "../../../types";
import { PlayerStat } from "./Stats";
import { FavorUi } from "./Favor";
import { Button } from "./Buttons";
import { Dice} from "./Dice";
import { subStates } from "../../../types";
import { isMyTurn, sortResultDices } from "../../../func/gameFunc";

interface PlayerProps {
    player: Player,
    second?: boolean,
    subState: [subStates, (state: subStates) => void],
    context: GameContext,
    send: (event: GameEvents) => void,
    state: GameStates,
    isOnline: boolean
}

export const PlayerComponent:FunctionComponent<PlayerProps> = ({player, second, subState, context, state, send, isOnline}) => {
        const {name, character, id} = player 
        const {curentThrower, players} = context
        const [MyPlayer, setMyPlayer] = useState<Player | undefined>(undefined);
        const noChooseFavorTime = [
            subStates.resolution, 
            subStates.pointRes, 
            subStates.favorOneRes, 
            subStates.favorTwoRes, 
            subStates.resultRes
        ]

        useEffect(() => {
            const foundPlayer = players.find(p => p.id === id);
            setMyPlayer(foundPlayer); // Met à jour l'état MyPlayer

            if (context.players.find(p => p.result.length < 6) === undefined && !noChooseFavorTime.includes(subState[0])) {
                subState[1](subStates.chooseFavor); 
            }
        }, [context, players, id]); // Dépendances : context, players, et id du joueur

        if (!MyPlayer) {
            return <div>Chargement ...</div>; // ou afficher un état de chargement si nécessaire
        }

        const handleClickAction = () => {
            console.log(context.players.find(p => p.result.length < 6) === undefined && MyPlayer!.result.length === 6)
            switch (subState[0]) {
                case subStates.throw:
                    send({type: "throwDices", playerId: id});
                    subState[1](subStates.chooseDice);
                    break;
                case subStates.chooseDice:
                    send({type: "selectDices", playerId: id});
                    if (context.players.find(p => p.result.length < 6) === undefined && MyPlayer!.result.length === 6) {
                        subState[1](subStates.chooseFavor);       
                    } else {
                        subState[1](subStates.throw);
                    }
                    break;
                default:
                    break;
            }
        }
        const handleChooseDice = (d: number) => {
            send({type: "chooseDice", dice: d, playerId: id})
        }

        return <div className={second ? "player__component second__player" : "player__component"}>
            <div className="player__side">
                <div className="left">
                    <div className="player__data">
                        <h2>{name.toUpperCase()}</h2>
                        <PlayerStat stats={MyPlayer!.stats} key={`stat_${MyPlayer!.id}_${MyPlayer!.stats.pv.update}_${MyPlayer!.stats.pp.update}`} />

                    </div>
                    <div className="player__actions">
                        {MyPlayer!.bonus !== undefined && <div>
                            {MyPlayer!.bonus.map(b => 
                                <div className="player__favors_bonus" key={Math.random()}>
                                    <Dice face={b.type} />
                                    <p style={MyPlayer!.bonus !== undefined && b.num < 0 ? { color: "var(--Negative)" } : { color: "var(--Positive)" }}>{b.num}</p>
                                </div>    
                            )}    
                        </div>}
                        {MyPlayer!.additionalDices !== undefined &&  
                        <div className="player__favors_additionals_dices">
                            {MyPlayer!.additionalDices.map(d => <Dice face={d.face} pp={d.pp} />)}
                        </div>}
                        {
                        state === GameStates.TURN && 
                        (curentThrower === id || context.players.find(p => p.id !== id)?.result.length === 6) && 
                        (MyPlayer!.count < 3) && 
                        (isMyTurn(curentThrower!) || !isOnline) &&
                        
                        <Button CtaType="cta-primary" onClick={handleClickAction}>
                            {subState?.[0] === subStates.throw ? "Throw dices" : "Validate"}
                        </Button>}
                    </div>
                </div>
                <div className="right">
                    <div className="dice__selectable">
                        {MyPlayer!.dices?.map(d => 
                            MyPlayer!.result[MyPlayer!.dices!.indexOf(d)] === undefined || 
                            MyPlayer!.result[MyPlayer!.dices!.indexOf(d)] === null ? 
                            <Dice face={d.face} pp={d.pp} key={Math.random()} selectable={subState[0] === subStates.chooseDice && curentThrower === id ? true : false} onClick={subState[0] === subStates.chooseDice && curentThrower === id ? () => handleChooseDice(MyPlayer!.dices!.indexOf(d)) : ()=>{}} selected={d.selected}/> : 
                            ""
                        )}    
                    </div>
                    <div className="dice__selected">
                        {MyPlayer!.result.sort((r, r2) => sortResultDices(r.face, second? second : false) - sortResultDices(r2.face, second? second : false)).map(d => <Dice face={d.face} pp={d.pp} key={Math.random()} selectable={false} />)}
                        {MyPlayer!.bannedDices !== undefined && MyPlayer!.bannedDices.sort((r, r2) => sortResultDices(r.face, second? second : false) - sortResultDices(r2.face, second? second : false)).map(d => <Dice face={d.face} pp={d.pp} key={Math.random()} selectable={false} banned={true}/>)}
                    </div>
                </div>
            </div>
            <div className="player__favors">
                {state === GameStates.TURN ? 
                MyPlayer!.favor?.map(f => f !== undefined && f!== null ? <FavorUi favor={f} key={Math.random()} subState={subState[0]} selectable={subState[0] === subStates.chooseFavor} selected={{current: f.selected? true : false, level: f.level? f.level : 0}} id={id} favorIndex={MyPlayer!.favor!.indexOf(f)}/> : '') :
                MyPlayer!.favor?.map(f => f !== undefined && f!== null && f.selected === true ? <FavorUi favor={f} key={Math.random()} selectable={subState[0] === subStates.chooseFavor} subState={subState[0]} selected={{current: f.selected? true : false, level: f.level? f.level : 0}} id={id} favorIndex={MyPlayer!.favor!.indexOf(f)}/> : '')
                }  
            </div> 
            <img src={"CharactersGame/"+character}  className="player__character"/>
        </div>
    
}
