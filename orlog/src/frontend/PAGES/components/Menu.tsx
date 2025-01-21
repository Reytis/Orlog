import { getUserId } from "../../../func/gameFunc";
import { GameContext, GameEvents } from "../../../types";
import { Button } from "./Buttons";

type MenuProps = {
    context: GameContext,
    send: (event: GameEvents) => void
    sendWithValidations: (event: GameEvents, player: string) => void
}
export function Menu({send, context, sendWithValidations}: MenuProps ) {

    return <div className="menu" style={{display:"none"}}>
        <h2>
            <span>{context.players.find(p => p.stats.pv.current > 0)?.name}</span> <br />
            A GAGNER
        </h2>
        <Button CtaType={"cta"} onClick={() => sendWithValidations({type: "restart"}, getUserId())}>REJOUER</Button>
        <Button CtaType={"cta"} onClick={() => send({type: "leave"})}>ACCEUIL</Button>
    </div>
}