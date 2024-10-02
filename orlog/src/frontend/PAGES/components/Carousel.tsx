import { useState, type FunctionComponent, type PropsWithChildren } from "react"
import { Input } from "./Input"
import { PlayerObject } from "../../../types"

type CarouselProps = PropsWithChildren<{
  elements: any[],
  type: string,
  scrollable? :boolean,
  maxChoice? :number,
  onChange :Function,
  choiced: string[],
  players?: PlayerObject[]
}>

export const Carousel: FunctionComponent<CarouselProps> = ({elements, type, scrollable=true, maxChoice, onChange, choiced, players}) => {
  const [position, setPosition] = useState<number>(0);
  // const [choiced, setChoice] = useState<string[]>([]);

  const handleOnWheel = (e: any) => {
    e.deltaY > 0 ?
    setPosition(position >= 90 ? 90 : position+2) :
    setPosition(position < 0 ? 0 : position-2)
  }
  // const handleChoice = (value:string) => {
  //   if(choiced.includes(value)) {
  //     setChoice(choiced.filter((items) => items !== value))
  //   } else {
  //     if (maxChoice && choiced.length < maxChoice) {
  //       setChoice([...choiced, value])
  //     }
  //   }
  // }
  const isMaxChoice = (value:string) => {
    return choiced.length >= maxChoice! && !choiced.includes(value)
  }
  let style = {transform: `translateX(-${position}%)`}


  return (<div className="carousel__container">
    <div className="carousel" onWheel={scrollable ? handleOnWheel : ()=>{}} style={style}>
        {elements.map(e => <div className="element" key={elements.indexOf(e)} >
            {e.props.favor ? 
            <Input 
              InputType={type} 
              onChange={onChange} 
              disabled={isMaxChoice(e.props.favor.name) && players?.find(p => p.favors.find(f => f === e.props.favor?.name) !== undefined) !== undefined}
              checked={choiced.includes(e.props.favor.name)}
              value={e.props.favor?.name}  
            /> : 
            <Input 
              InputType={type} 
              onChange={onChange} 
              disabled={isMaxChoice(e.props.src)}
              checked={choiced.includes(e.props.src)}
              value={e.props.src}  
            />
            }
            {e}
        </div>)}
    </div>    
  </div>
  )
}