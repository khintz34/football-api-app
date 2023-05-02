import { useTeamStore } from "@/stores/teamStore";
// import { findTeam } from "./api/teams";
import { useEffect, useState } from "react";
import styles from "../styles/teamPage.module.css";
import { GiHamburgerMenu } from "react-icons/gi";
import Header from "@/components/header";
import { findLeague, findStandings } from "./api/teams";

function TeamPage() {
  const teamId = useTeamStore((state) => state.id);
  const teamTeam = useTeamStore((state) => state.team);
  const fullData = useTeamStore((state) => state.fullData);
  const stats = useTeamStore((state) => state.statistics);
  const changeStats = useTeamStore((state) => state.changeStats);
  const [wins, setWins] = useState(0);
  const [draws, setDraws] = useState(0);
  const [loses, setLoses] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [position, setPosition] = useState(0);
  const [rankingArray, setRankingArray] = useState([]);
  // console.log(fullData);
  // console.log(teamTeam);
  // need to get team info

  // console.log(teamTeam);
  // console.log(stats);

  async function findTeam(id) {
    const url = `https://api-football-v1.p.rapidapi.com/v3/teams/statistics?league=39&season=2022&team=${id}`;
    const url2 = `https://api-football-v1.p.rapidapi.com/v3/standings?season=2022&team=${id}`;

    const options = {
      method: "GET",
      headers: {
        "content-type": "application/octet-stream",
        "X-RapidAPI-Key": "52e45221aamsh291d365e94c68ecp10cee2jsn6c88101151c8",
        "X-RapidAPI-Host": "api-football-v1.p.rapidapi.com",
      },
    };

    try {
      const response = await fetch(url, options);
      const response2 = await fetch(url2, options);
      const result = await response.json();
      const result2 = await response2.json();
      // console.log("findTeam");
      // console.log(result.response);
      changeStats(result.response);
      setWins(result.response.fixtures.wins.total);
      setDraws(result.response.fixtures.draws.total);
      setLoses(result.response.fixtures.loses.total);
      setRankingArray(result2.response);
      lookForPos(result2.response);
      // console.log(result2.response);
      return result;
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    lookForPos(rankingArray);
  });

  function lookForPos(data) {
    data.map((val) => {
      console.log("val: ", val);
      if (val.league.name === "Premier League") {
        setPosition(val.league.standings[0][0].rank);
        console.log(val.league.standings[0][0].rank, "RANK");
      }
    });
  }

  useEffect(() => {
    setTotalPoints(wins * 3 + draws);
  }, [wins]);

  // useEffect(() => {
  //   findTeam(teamId);
  // }, []);

  return (
    <div className={`${styles.teamPage}`}>
      <Header />

      <img
        src={teamTeam.team.logo}
        alt="Team Logo"
        className={`${styles.teamLogo}`}
      />
      <div className={`${styles.marginBtn} ${styles.infoDiv}`}>
        <h2 className={styles.infoH2}>{teamTeam.venue.name}</h2>
        <h2 className={styles.infoH2}>{teamTeam.venue.address}</h2>
        <h2 className={styles.infoH2}>{teamTeam.venue.city}</h2>
        <h2 className={styles.infoH2}>Founded: {teamTeam.team.founded}</h2>
      </div>

      <div>
        <button
          onClick={() => {
            findTeam(teamId);
            // findStandings();
          }}
          style={{ width: "50vw", height: "5vh" }}
        >
          Calc
        </button>
        <table className={styles.table}>
          <thead>
            {" "}
            <th>Wins</th>
            <th>Draws</th>
            <th>Loses</th>
            <th>Total Points</th>
            <th>Pos</th>
          </thead>
          <tbody>
            <tr>
              <td>{wins}</td>
              <td>{draws}</td>
              <td>{loses}</td>
              <td>{totalPoints}</td>
              <td>{position}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className={`${styles.buttonListContainer}`}>
        <h3>See More</h3>
        <div className={`${styles.buttonList}`}>
          <button className={styles.moreBtn}>Stats</button>
          <button className={styles.moreBtn}>Fixture List</button>
          <button className={styles.moreBtn}>Standings</button>
          <button className={styles.moreBtn}>Roster</button>
          <button className={styles.moreBtn}>Transfers</button>
          <button className={styles.moreBtn}>Coaches</button>
        </div>
      </div>
    </div>
  );
}

export default TeamPage;
