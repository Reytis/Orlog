import type { FunctionComponent, PropsWithChildren } from "react"
import { Player } from "../../../types"

type StatProps = PropsWithChildren<{
  stats:Player["stats"]
}>

export const PlayerStat: FunctionComponent<StatProps> = ({stats}) => {

  return (
    <div className="stat">
        <div className="pv">
            <img src="assets/PV.png" width="60px"/>
            <p className="stat_text">
                {stats.pv.current}
                Pv
            </p>
            <p className="update" style={stats.pv.update >= 0 ? {color: "var(--Positive)", top: "-25%"} : {color: "var(--Negative)", top: "30%"}}>
                {stats.pv.update >= 0 ? "+" + stats.pv.update : stats.pv.update}Pp
            </p>
        </div>
        <div className="pp">
            <img src="assets/PP.png" width="60px"/>
            <p className="stat_text">
                {stats.pp.current}
                Pp
            </p>
            <p className="update" style={stats.pp.update >= 0 ? {color: "var(--Positive)", top: "-25%"} : {color: "var(--Negative)", top: "30%"}}>
                {stats.pp.update >= 0 ? "+" + stats.pp.update : stats.pp.update}Pp
            </p>
        </div>
    </div>
  )
}