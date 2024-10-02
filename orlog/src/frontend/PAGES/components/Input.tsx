import { useState, type FunctionComponent, type PropsWithChildren } from "react"

type InputsProps = PropsWithChildren<{
  InputType:string,
  disabled?:boolean,
  onChange: Function,
  checked?: boolean
  value: string
}>

export const Input: FunctionComponent<InputsProps> = ({InputType, children, disabled, onChange, value, checked}) => {
  const [v, setValue] = useState(value)

  return (
    <input type={InputType} disabled={disabled} placeholder={children?.toString()} onChange={InputType === "checkbox" ? () => onChange(value) : e => {onChange(e.target.value); setValue(e.target.value)}} value={v} checked={checked}/>
  )
}