import { useEffect, useState } from "react"
import { Character, GameContext, GameEvents, Gods, Player, PlayerObject } from "../../types"
import { Button } from "./components/Buttons"
import { Carousel } from "./components/Carousel"
import { FavorUi } from "./components/Favor"
import { Input } from "./components/Input"
import { SetUpGame } from "./components/SetUpGame"
import { v4 as uuidv4 } from 'uuid';
import { convertPlayerToPlayerObject, resetMyTurnId, setMyTurnId } from "../../func/gameFunc"

export const FavorsList = [
    <FavorUi favor={{
        selected: false,
        level: null,
        name: Gods.thor,
        priority: 6,
        cost: [4,8,12],
        target: undefined,
        sacrifice: undefined,
        description: "Deal damage to the opponent after Resolution phase."
    }} />,
    <FavorUi favor={{
        selected: false,
        level: null,
        name: Gods.hel,
        priority: 4,
        cost: [6,12,18],
        target: undefined,
        sacrifice: undefined,
        description: "Each AXE damage delt to the opponent heals you."
    }} />,
    <FavorUi favor={{
        selected: false,
        level: null,
        name: Gods.vidar,
        priority: 4,
        cost: [2,4,6],
        target: undefined,
        sacrifice: undefined,
        description: "Remove HELMET from the opponent."
    }} />,
    <FavorUi favor={{
        selected: false,
        level: null,
        name: Gods.heimdall,
        priority: 4,
        cost: [4,7,10],
        target: undefined,
        sacrifice: undefined,
        description: "Heal Health for each attack you block."
    }} />,
    <FavorUi favor={{
        selected: false,
        level: null,
        name: Gods.skadi,
        priority: 4,
        cost: [6,10,14],
        target: undefined,
        sacrifice: undefined,
        description: "Add ARROW to each die that rolled ARROW."
    }} />,
    <FavorUi favor={{
        selected: false,
        level: null,
        name: Gods.ullr,
        priority: 4,
        cost: [2,3,4],
        target: undefined,
        sacrifice: undefined,
        description: "Your ARROW ignore the opponent's SHIELD."
    }} />,
    <FavorUi favor={{
        selected: false,
        level: null,
        name: Gods.baldr,
        priority: 4,
        cost: [3,6,9],
        target: undefined,
        sacrifice: undefined,
        description: "Add HELMET or SHIELD for each die that rolled HELMET or SHIELD."
    }} />,
    <FavorUi favor={{
        selected: false,
        level: null,
        name: Gods.freyja,
        priority: 2,
        cost: [2,4,6],
        target: undefined,
        sacrifice: undefined,
        description: "Roll additional dice this round."
    }} />,
    <FavorUi favor={{
        selected: false,
        level: null,
        name: Gods.freyr,
        priority: 4,
        cost: [4,6,8],
        target: undefined,
        sacrifice: undefined,
        description: "Add to the total of whichever face is in majority."
    }} />,
    <FavorUi favor={{
        selected: false,
        level: null,
        name: Gods.idunn,
        priority: 7,
        cost: [4,7,10],
        target: undefined,
        sacrifice: undefined,
        description: "Heal Health after Resolution phase."
    }} />,
    <FavorUi favor={{
        selected: false,
        level: null,
        name: Gods.brunhild,
        priority: 4,
        cost: [6,10,18],
        target: undefined,
        sacrifice: undefined,
        description: "Multiply AXE, rounded up."
    }} />,
    <FavorUi favor={{
        selected: false,
        level: null,
        name: Gods.skuld,
        priority: 3,
        cost: [4,6,8],
        target: undefined,
        sacrifice: undefined,
        description: "Destroy opponent's PP for each die that rolled ARROW."
    }} />,
    <FavorUi favor={{
        selected: false,
        level: null,
        name: Gods.frigg,
        priority: 2,
        cost: [2,3,4],
        target: undefined,
        sacrifice: undefined,
        description: "Reroll any of your or your opponent's dice."
    }} />,
    <FavorUi favor={{
        selected: false,
        level: null,
        name: Gods.mimir,
        priority: 4,
        cost: [3,5,7],
        target: undefined,
        sacrifice: undefined,
        description: "Gain PP for each damage dealt to you this round."
    }} />,
    <FavorUi favor={{
        selected: false,
        level: null,
        name: Gods.loki,
        priority: 2,
        cost: [3,6,9],
        target: undefined,
        sacrifice: undefined,
        description: "Ban opponent's dice for the round."
    }} />,
    <FavorUi favor={{
        selected: false,
        level: null,
        name: Gods.bragi,
        priority: 4,
        cost: [4,8,12],
        target: undefined,
        sacrifice: undefined,
        description: "Gain PP for each die that rolled HAND."
    }} />,
    <FavorUi favor={{
        selected: false,
        level: null,
        name: Gods.odin,
        priority: 7,
        cost: [6,8,10],
        target: undefined,
        sacrifice: undefined,
        description: "After Resolution phase sacrifice any Health and Gain PP for each."
    }} />,
    <FavorUi favor={{
        selected: false,
        level: null,
        name: Gods.var,
        priority: 1,
        cost: [10,14,18],
        target: undefined,
        sacrifice: undefined,
        description: "Each PP spent by your opponent heals you."
    }} />,
    <FavorUi favor={{
        selected: false,
        level: null,
        name: Gods.thrymr,
        priority: 1,
        cost: [4,8,12],
        target: undefined,
        sacrifice: undefined,
        description: "Reduce the effect level of a God Favor invoked by the opponents this round."
    }} />,
    <FavorUi favor={{
        selected: false,
        level: null,
        name: Gods.tyr,
        priority: 3,
        cost: [4,6,8],
        target: undefined,
        sacrifice: undefined,
        description: "Sacrifice any HEalth and destroy opponent's PP for each."
    }} />
]
const CharacterList = [
    <img src={"assets/character/valka.png"} className="character-list" alt="valka"/>,
    <img src={"assets/character/sigurd.png"} className="character-list" alt="sigurd"/>,
    <img src={"assets/character/eivor-homme.png"} className="character-list" alt="eivor-homme"/>,
    <img src={"assets/character/eivor-femme.png"} className="character-list" alt="eivor-femme"/>
]
type FormProps = {
    isOnline: boolean,
    onIdDefined: (id: string) => void
    onIdDelete: (id: string) => void
    context: GameContext,
    send: (event: GameEvents) => void
    sendWithValidations: (event: GameEvents, player: string) => void
}
export const CreatePlayerForm = ({isOnline, onIdDefined, onIdDelete, context, send, sendWithValidations}: FormProps) => {
    const [players, setPlayer] = useState<PlayerObject[]>([])
    const [selectedFavors, setSelectedFavors] = useState<string[]>([]);
    const [selectedCharacter, setSelectedCharacter] = useState<Character[]>([]);
    const [selectedName, setSelectedName] = useState<string>("")
    
    // Ajouter un état pour gérer les joueurs mis à jour
    const [updatedPlayers, setUpdatedPlayers] = useState<PlayerObject[]>([]);
    
    // Effect to populate players from context.players
    useEffect(() => {
        if (context.players) {
            // Convert each player to PlayerObject
            context.players.forEach(p => onIdDefined(p.id))
            
            // Convertir chaque joueur en PlayerObject et mettre à jour l'état
            const convertedPlayers = context.players.map((player: Player) => convertPlayerToPlayerObject(player));
            setUpdatedPlayers(convertedPlayers);  // Mettre à jour l'état ici
        }
    }, [context.players]); // Re-run effect when context.players changes
    
    const handleFavorChange = (selectedItems: string) => {
        if(selectedFavors.includes(selectedItems)) {
            setSelectedFavors(selectedFavors.filter((items) => items !== selectedItems))
        } else {
            if (selectedFavors.length < 3) {
                setSelectedFavors([...selectedFavors, selectedItems])
            }
        }
    }
    const handleCharacterChange = (selectedItems: Character) => {
        if(selectedCharacter.includes(selectedItems)) {
            setSelectedCharacter(selectedCharacter.filter((items) => items !== selectedItems))
        } else {
            if (selectedCharacter.length < 3) {
                setSelectedCharacter([...selectedCharacter, selectedItems])
            }
        }
    }
    const handleSubmit = () => {
        const player:PlayerObject = {
            name: selectedName,
            character: selectedCharacter,
            favors: [
                FavorsList.find(f => f.props.favor.name === selectedFavors[0])?.props.favor,
                FavorsList.find(f => f.props.favor.name === selectedFavors[1])?.props.favor,
                FavorsList.find(f => f.props.favor.name === selectedFavors[2])?.props.favor
            ],
            position: uuidv4()
        }
        const { name, character, favors, position} = player
        send({type: 'setUpGame',  
            playerId: position, 
            playerName: name, 
            playerCharacter: character[0],  
            playerFavor: favors,
            playerCount: 0,
            playerResult: [],
            playerIsReady: false,
            playerStat: {
                pv: {current: 15, update: 0},
                pp: {current: 0, update: 0}
            },
            playerDice: undefined
        })
        setPlayer([...players, player])
        setMyTurnId(position)
    }
    
    const handleRemovePlayer = (selectedP: PlayerObject) => {
        send({type: 'dropPlayer', playerId: selectedP.position})
        onIdDelete(selectedP.position)
        setPlayer(players.filter(p => p.position !== selectedP.position))
        resetMyTurnId(selectedP.position)
    }
    
    return <div className="form__page">
    <div className="player__form" style={{width: players.length > 0 ? "70vw" : "100vw"}}>
    <h1>Créez vos joueurs</h1>
    <div className="form">
    <div className="form__section name">
    <p>Votre Pseudonyme</p>
    <Input InputType={"text"} value={selectedName} onChange={setSelectedName}>Eivor</Input>
    </div>
    <div className="form__section favors">
    <p>Choisissez vos faveurs <span className="form-span">3max (optionnel) scrollable</span></p>
    <Carousel elements={FavorsList} type="checkbox" maxChoice={3} onChange={handleFavorChange} choiced={selectedFavors} players={players}/>
    </div>
    <div className="form__section character">
    <p>Choisissez votre personnage <span className="form-span">(optionnel)</span></p>
    <Carousel elements={CharacterList} type="checkbox" scrollable={false} maxChoice={1} onChange={handleCharacterChange} choiced={selectedCharacter}/>
    </div>
    <div className="form_button"><Button CtaType={"cta-primary"} onClick={handleSubmit} disabled={players.length === 2 || (isOnline && players.length === 1 || selectedName === "")}>Ajouter le joueurs</Button></div>
    <div className="blur_effect"></div>
    </div>
    
    </div>
    <SetUpGame value={updatedPlayers.length} players={updatedPlayers} onChange={handleRemovePlayer} sendWithValidations={sendWithValidations} />
    </div>
}