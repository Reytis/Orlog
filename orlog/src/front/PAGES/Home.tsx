import { Button } from "./components/Buttons";

export function Home() {
    return <>
    <div className="Home">
        <h1>
            Assassin's Creed <br />
            Orlog
        </h1>
        <p>Le jeu d’Orlog disponible dans assassin’s Creed Valhalla <br /> en version 2 joueurs local ou en ligne !</p>
      
        <Button CtaType="cta" onClick={() => {}}> Jouer en local </Button>
        <Button CtaType="cta" disabled onClick={() => {}}> Jouer en ligne </Button>
    </div>
    </>
}