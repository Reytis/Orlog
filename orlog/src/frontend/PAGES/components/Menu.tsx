import { useGame } from "../../hooks/useGame";
import { Button } from "./Buttons";

export function Menu() {
    const {context, send} = useGame()

    return <div className="menu" style={{display:"none"}}>
        <h2>
            <span>{context.players.find(p => p.stats.pv.current > 0)?.name}</span> <br />
            A GAGNER
        </h2>
        <Button CtaType={"cta"} onClick={() => send({type: "restart"})}>REJOUER</Button>
        <Button CtaType={"cta"} onClick={() => send({type: "leave"})}>ACCEUIL</Button>
    </div>
}