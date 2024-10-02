import { useState, type FunctionComponent, type PropsWithChildren } from "react"
import { Favor, GameStates, Player } from "../../../types"
import { useGame } from "../../hooks/useGame"
import { Input } from "./Input"
import { subStates } from "../Game"


type FavorProps = PropsWithChildren<{
  favor: Favor,
  selectable? :boolean,
  selected?: {current:boolean, level:number},
  id?: Player["id"],
  favorIndex?: number,
  subState?: subStates
}>

export const FavorUi: FunctionComponent<FavorProps> = ({favor, selectable, selected, id, favorIndex, subState}) => {
  let levelOptions: JSX.Element[] = []
  const {send, state} = useGame()
  const [value, setValue] = useState("0")

  const handleChooseFavor = (d: number, l: number, s: number) => {
    if (id !== undefined) {
      send({ type: "selectFavor", playerId: id, selectedFavor: d, level: l, sacrifice: s});
    }
  };

  favor.cost?.forEach((c, index) => {
    levelOptions.push(
      <span
        key={c}
        className={
          selected?.current && selected.level === index + 1 ? "" : "cost"
        }
        onClick={selectable ? () => handleChooseFavor(favorIndex!, index + 1, parseInt(value)) : () => {}}
      >
        {c}
      </span>
    );
  });

  return (
    <div className="favor">
        <div className="favor_title">
            <p>{favor.name.toUpperCase()}</p>
            <span className="priority">priority: {favor.priority}</span>
        </div>
        <div className="favor_description">
            <img src={`assets/favors/${favor.name}_orlog.png`}/>
            <p className="description">
                {favor.description}
            </p>
        </div>
        {(favor.name === "odin" || favor.name === "tyr") && state === GameStates.TURN && subState === subStates.chooseFavor && <Input InputType={"number"} onChange={setValue} value={favor.sacrifice === undefined ? value : favor.sacrifice.toString()} />}
        <p className="cost">{levelOptions.map(o => levelOptions.indexOf(o) === 2 ? o : [o, " - "])}</p>
    </div>
  )
}