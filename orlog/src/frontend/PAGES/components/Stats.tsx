import { FunctionComponent, PropsWithChildren, useEffect, useRef } from "react";
import { Player } from "../../../types";

type StatProps = PropsWithChildren<{
  stats: Player["stats"];
}>;

export const PlayerStat: FunctionComponent<StatProps> = ({ stats }) => {
  const refPV = useRef<HTMLParagraphElement | null>(null);
  const refPP = useRef<HTMLParagraphElement | null>(null);

  useEffect(() => {
    const paragraphPV = refPV.current;
    const paragraphPP = refPP.current;

    if (paragraphPV && stats.pv.update !== 0) {
      // Add animation class
      paragraphPV.classList.add("called");

      // Remove animation class after the duration
      const timeoutPV = setTimeout(() => {
        paragraphPV.classList.remove("called");
      }, 1000); // Duration of the animation

      // Cleanup function
      return () => clearTimeout(timeoutPV);
    }

    if (paragraphPP && stats.pp.update !== 0) {
      // Add animation class
      paragraphPP.classList.add("called");

      // Remove animation class after the duration
      const timeoutPP = setTimeout(() => {
        paragraphPP.classList.remove("called");
      }, 1000); // Duration of the animation

      // Cleanup function
      return () => clearTimeout(timeoutPP);
    }
  }, [stats.pv.update, stats.pp.update]); // Depend on the specific updates (PV or PP)

  return (
    <div className="stat">
      <div className="pv">
        <img src="assets/PV.png" width="60px" alt="pv icon" />
        <p className="stat_text">
          {stats.pv.current}
          Pv
        </p>
        <p
          ref={refPV}
          className="update"
          style={
            stats.pv.update >= 0
              ? { color: "var(--Positive)", top: "-25%" }
              : { color: "var(--Negative)", top: "30%" }
          }
        >
          {stats.pv.update >= 0 ? "+" + stats.pv.update : stats.pv.update}Pv
        </p>
      </div>
      <div className="pp">
        <img src="assets/PP.png" width="60px" alt="pp icon" />
        <p className="stat_text">
          {stats.pp.current}
          Pp
        </p>
        <p
          ref={refPP}
          className="update"
          style={
            stats.pp.update >= 0
              ? { color: "var(--Positive)", top: "-25%" }
              : { color: "var(--Negative)", top: "30%" }
          }
        >
          {stats.pp.update >= 0 ? "+" + stats.pp.update : stats.pp.update}Pp
        </p>
      </div>
    </div>
  );
};
