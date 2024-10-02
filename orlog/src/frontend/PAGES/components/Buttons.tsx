import type { FunctionComponent, PropsWithChildren } from "react"

type BtnProps = PropsWithChildren<{
  CtaType:string,
  disabled?:boolean
  onClick :()=>void
}>

export const Button: FunctionComponent<BtnProps> = ({CtaType, children, disabled, onClick}) => {
  return (
    <button className={CtaType} disabled={disabled} onClick={() => onClick()}>
      {children}
    </button>
  )
}
