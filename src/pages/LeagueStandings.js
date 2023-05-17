import Header from "@/components/header";
import Standings from "@/components/Standings";
import { useEffect, useState } from "react";
import styles from "../styles/leagueStandings.module.css";

function LeagueStandings() {
  return (
    <div>
      <Header />
      <div className={styles.leagueStandingsMain}>
        <Standings />
      </div>
    </div>
  );
}

export default LeagueStandings;
