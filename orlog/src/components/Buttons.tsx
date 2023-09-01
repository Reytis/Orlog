import type { FunctionComponent, PropsWithChildren } from "react"

type BtnProps = PropsWithChildren<{
  CtaType:string,
  disabled?:boolean
}>

export const Button: FunctionComponent<BtnProps> = ({CtaType, children, disabled}) => {
  return (
    <button className={CtaType} disabled={disabled} >
      {children}
    </button>
  )
}
