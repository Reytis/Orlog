import { type FunctionComponent, type PropsWithChildren, useEffect, useRef } from "react"
import { Player } from "../../../types"

type StatProps = PropsWithChildren<{
  stats:Player["stats"]
}>

export const PlayerStat: FunctionComponent<StatProps> = ({stats}) => {
    const ref = useRef<HTMLParagraphElement | null>(null)
    const refTwo = useRef<HTMLParagraphElement | null>(null)

    useEffect(() => {
        const paragraphPV = ref.current
        const paragraphPP = refTwo.current

        if (paragraphPV && stats.pv.update !== 0) {
            paragraphPV?.classList.add('called')

            const timeout = setTimeout(()=>{
                paragraphPV?.classList.remove('called')
            }, 1000)

            return () => clearTimeout(timeout)
        }
        if (paragraphPP && stats.pp.update !== 0) {
            paragraphPP?.classList.add('called')

            const timeout = setTimeout(()=>{
                paragraphPV?.classList.remove('called')
                paragraphPP?.classList.remove('called')
            }, 1000)

            return () => clearTimeout(timeout)
        }

    }, [stats])

    return (
        <div className="stat">
            <div className="pv">
                <img src="assets/PV.png" width="60px"/>
                <p className="stat_text">
                    {stats.pv.current}
                    Pv
                </p>
                <p ref={ref} className="update" style={stats.pv.update >= 0 ? {color: "var(--Positive)", top: "-25%"} : {color: "var(--Negative)", top: "30%"}}>
                    {stats.pv.update >= 0 ? "+" + stats.pv.update : stats.pv.update}Pp
                </p>
            </div>
            <div className="pp">
                <img src="assets/PP.png" width="60px"/>
                <p className="stat_text">
                    {stats.pp.current}
                    Pp
                </p>
                <p ref={refTwo} className="update" style={stats.pp.update >= 0 ? {color: "var(--Positive)", top: "-25%"} : {color: "var(--Negative)", top: "30%"}}>
                    {stats.pp.update >= 0 ? "+" + stats.pp.update : stats.pp.update}Pp
                </p>
            </div>
        </div>
    )
}