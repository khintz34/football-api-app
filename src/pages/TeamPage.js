import { useTeamStore } from "@/stores/teamStore";
// import { findTeam } from "./api/teams";
import { useEffect, useState } from "react";
import styles from "../styles/teamPage.module.css";
import { GiHamburgerMenu } from "react-icons/gi";
import Header from "@/components/header";
import { findLeague, findStandings } from "./api/teams";
import StatsTeam from "@/components/StatsTeam";

function TeamPage() {
  const teamId = useTeamStore((state) => state.id);
  const teamTeam = useTeamStore((state) => state.team);
  const fullData = useTeamStore((state) => state.fullData);
  const stats = useTeamStore((state) => state.statistics);
  const changeStats = useTeamStore((state) => state.changeStats);
  const changeTeamStats = useTeamStore((state) => state.changeTeamStats);
  const teamStats = useTeamStore((state) => state.teamStats);
  const [wins, setWins] = useState(0);
  const [draws, setDraws] = useState(0);
  const [loses, setLoses] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [position, setPosition] = useState(0);
  const [rankingArray, setRankingArray] = useState([]);
  const [statStatus, setStatStatus] = useState("styles.hide");
  const [yellowCards, setYellowCards] = useState(0);
  const [redCards, setRedCards] = useState(0);
  const [currentForm, setCurrentForm] = useState(null);
  const [againstLeast, setAgainstLeast] = useState({});
  const [againstMost, setAgainstMost] = useState({});
  const [forLeast, setForLeast] = useState({});
  const [forMost, setForMost] = useState({});
  const [displayStat, setDisplayStat] = useState(null);

  function calcCards(data) {
    let yellow = 0;
    const yellowArray = Object.entries(data.yellow);
    yellowArray.map((val) => {
      yellow += val[1].total;
    });
    setYellowCards(yellow);

    let red = 0;
    const redArray = Object.entries(data.red);
    redArray.map((val) => {
      red += val[1].total;
    });
    setRedCards(red);

    let formHold = teamStats.form;
    console.log(formHold);
    setCurrentForm(formHold.substring(0, 5));
  }

  function calcGoals(data) {
    //calc away goals against
    let againstArray = Object.entries(data.against.minute);
    let againstMostHold = againstArray[0];
    let againstLeastHold = againstArray[0];

    for (let i = 0; i < 6; i++) {
      if (againstArray[i][1].total < againstLeastHold[1].total) {
        againstLeastHold = againstArray[i];
      } else if (againstArray[i][1].total > againstMostHold[1].total) {
        againstMostHold = againstArray[i];
      }
    }
    setAgainstLeast(againstLeastHold);
    setAgainstMost(againstMostHold);

    //calc home goals against
    let forArray = Object.entries(data.for.minute);
    let forMostHold = forArray[0];
    let forLeastHold = forArray[0];

    for (let i = 0; i < 6; i++) {
      if (forArray[i][1].total < forLeastHold[1].total) {
        forLeastHold = forArray[i];
      } else if (forArray[i][1].total > forMostHold[1].total) {
        forMostHold = forArray[i];
      }
    }
    setForLeast(forLeastHold);
    setForMost(forMostHold);
  }

  async function fetchData(id, option) {
    const url = `https://api-football-v1.p.rapidapi.com/v3/teams/statistics?league=39&season=2022&team=${id}`;
    const url2 = `https://api-football-v1.p.rapidapi.com/v3/standings?season=2022&team=${id}`;
    const url3 = `https://api-football-v1.p.rapidapi.com/v3/teams/statistics?league=39&season=2022&team=${id}`;

    const options = {
      method: "GET",
      headers: {
        "content-type": "application/octet-stream",
        "X-RapidAPI-Key": "52e45221aamsh291d365e94c68ecp10cee2jsn6c88101151c8",
        "X-RapidAPI-Host": "api-football-v1.p.rapidapi.com",
      },
    };

    if (option === 1) {
      try {
        const response = await fetch(url, options);
        const response2 = await fetch(url2, options);
        const result = await response.json();
        const result2 = await response2.json();
        changeStats(result.response);
        setWins(result.response.fixtures.wins.total);
        setDraws(result.response.fixtures.draws.total);
        setLoses(result.response.fixtures.loses.total);
        setRankingArray(result2.response);
        lookForPos(result2.response);
        return result;
      } catch (error) {
        console.error(error);
      }
    } else {
      try {
        const response = await fetch(url3, options);
        const result = await response.json();
        changeTeamStats(result.response);
        console.log(result.response);
        calcCards(result.response.cards);
        calcGoals(result.response.goals);
        return result;
      } catch (error) {
        console.error(error);
      }
    }
  }

  useEffect(() => {
    lookForPos(rankingArray);
  });

  function toggleStatStatus() {
    console.log(statStatus);
    if (statStatus === "teamPage_show__Sfksl") {
      setStatStatus(`${styles.hide}`);
    } else {
      setStatStatus(`${styles.show}`);
    }
  }

  function toggleDisplayStat(val) {
    if (val === displayStat) {
      setDisplayStat(null);
    } else {
      setDisplayStat(val);
    }
  }

  function lookForPos(data) {
    data.map((val) => {
      if (val.league.name === "Premier League") {
        setPosition(val.league.standings[0][0].rank);
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
        <h2 className={styles.infoH2}>{teamTeam.venue.city}</h2>
        <h2 className={styles.infoH2}>Founded: {teamTeam.team.founded}</h2>
      </div>

      <div>
        <button
          onClick={() => {
            fetchData(teamId, 1);
            // findStandings();
          }}
          style={{ width: "50vw", height: "5vh" }}
        >
          Calc
        </button>
        <table className={styles.table}>
          <thead>
            <th style={{ color: "rgb(8, 205, 8)" }}>Wins</th>
            <th style={{ color: "yellow" }}>Draws</th>
            <th style={{ color: "red" }}>Loses</th>
            <th>Total Points</th>
            <th>Pos</th>
          </thead>
          <tbody>
            <tr>
              <td style={{ color: "rgb(8, 205, 8)" }}>{wins}</td>
              <td style={{ color: "yellow" }}>{draws}</td>
              <td style={{ color: "red" }}>{loses}</td>
              <td>{totalPoints}</td>
              <td>{position}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className={`${styles.buttonListContainer}`}>
        <h3>See More</h3>
        <div className={`${styles.buttonList}`}>
          <button
            className={styles.moreBtn}
            onClick={() => {
              // fetchData(teamId, 2);
              setStatStatus(`${styles.show}`);
              toggleStatStatus();
              toggleDisplayStat("StatsTeam");
            }}
          >
            Stats
          </button>
          <button className={styles.moreBtn}>Fixture List</button>
          <button className={styles.moreBtn}>Standings</button>
          <button className={styles.moreBtn}>Roster</button>
          <button className={styles.moreBtn}>Transfers</button>
          <button className={styles.moreBtn}>Coaches</button>
        </div>
        <div className={`${styles.statBox} ${statStatus}`}>
          {displayStat === null ? (
            ""
          ) : displayStat === "StatsTeam" ? (
            <StatsTeam />
          ) : (
            "ERROR"
          )}
        </div>
      </div>
    </div>
  );
}

export default TeamPage;
