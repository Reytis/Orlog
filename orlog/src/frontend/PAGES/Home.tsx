import { Button } from "./components/Buttons";
import './Home.css'

type HomeProps = {
    onClickSolo: () => void
    onClickPrivate: () => void
    onClickMulti: () => void
}
export function Home({onClickSolo, onClickMulti, onClickPrivate}: HomeProps) {
    return <>
    <div className="Home">
        <h1>
            Assassin's Creed <br />
            Orlog
        </h1>
        <p>Le jeu d’Orlog disponible dans assassin’s Creed Valhalla <br /> en version 2 joueurs local ou en ligne !</p>

        <div className="ctas">
            <Button CtaType="cta" disabled onClick={onClickMulti}> Jouer en ligne </Button>
            <Button CtaType="cta" onClick={onClickPrivate}> Crée une partie privé </Button>
            <Button CtaType="cta" onClick={onClickSolo}> Jouer en local </Button>
        </div>  
    </div>
    </>
}