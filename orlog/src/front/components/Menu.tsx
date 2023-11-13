import { Button } from "./Buttons";

export function Menu() {

    return <div className="menu" style={{display:"none"}}>
        <h2>
            <span>PlayerName</span> <br />
            A GAGNER
        </h2>
        <Button CtaType={"cta"}>REJOUER</Button>
        <Button CtaType={"cta"}>ACCEUIL</Button>
    </div>
}