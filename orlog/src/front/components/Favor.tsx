import { useState, type FunctionComponent, type PropsWithChildren } from "react"
import { Favor } from "../../types"


type FavorProps = PropsWithChildren<{
  favor: Favor
}>

export const FavorUi: FunctionComponent<FavorProps> = ({favor}) => {
  let levelOptions: JSX.Element[] = []
  const [options, setOptions] = useState(0)

  favor.cost?.forEach(c => {
    switch (favor.cost?.indexOf(c)) {
      case 0:
        levelOptions.push(<span key={c} className={favor.cost?.indexOf(c)+1 === options ? "" : "cost"} onClick={() => options === 1 ? setOptions(0) : setOptions(1)}>{c}</span>)
        break;
      case 1:
        levelOptions.push(<span key={c} className={favor.cost?.indexOf(c)+1 === options ? "" : "cost"} onClick={() => options === 2 ? setOptions(0) : setOptions(2)}>{c}</span>)
        break;
      case 2:
        levelOptions.push(<span key={c} className={favor.cost?.indexOf(c)+1 === options ? "" : "cost"} onClick={() => {options === 3 ? setOptions(0) : setOptions(3)}}>{c}</span>)
        break;
      default:
        break;
    }
    
  })

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
        <p className="cost">{levelOptions.map(o => levelOptions.indexOf(o) === 2 ? o : [o, " - "])}</p>
    </div>
  )
}