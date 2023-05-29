import { useTeamStore } from "@/stores/teamStore";
import { useEffect, useState } from "react";
import styles from "../../styles/teamPage.module.css";
import { GiHamburgerMenu } from "react-icons/gi";
import Header from "@/components/header";
import { findLeague, findStandings } from "../api/teams";
import StatsTeam from "@/components/StatsTeam";
import FixtureList from "@/components/FixtureList";
import Standings from "@/components/Standings";
import Roster from "@/components/Roster";
import { seasonList } from "@/assets/seasonList";
import { useRouter } from "next/router";
import { teamLogo } from "../../assets/teamLogo.jpg";

function TeamPage() {
  const teamId = useTeamStore((state) => state.id);
  const changeId = useTeamStore((state) => state.changeId);
  const changeTeamName = useTeamStore((state) => state.changeTeamName);
  const teamTeam = useTeamStore((state) => state.team);
  const stats = useTeamStore((state) => state.statistics);
  const changeStats = useTeamStore((state) => state.changeStats);
  const changeTeamStats = useTeamStore((state) => state.changeTeamStats);
  const teamStats = useTeamStore((state) => state.teamStats);
  const header = useTeamStore((state) => state.header);
  const changeHeader = useTeamStore((state) => state.changeHeader);
  const season = useTeamStore((state) => state.season);
  const changeSeason = useTeamStore((state) => state.changeSeason);
  const [wins, setWins] = useState(0);
  const [draws, setDraws] = useState(0);
  const [loses, setLoses] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [position, setPosition] = useState(0);
  const [rankingArray, setRankingArray] = useState([]);
  const [statStatus, setStatStatus] = useState("styles.hide");
  const [displayStat, setDisplayStat] = useState(null);
  const [teamInfo, setTeamInfo] = useState([
    {
      team: {
        name: "Team Name",
        founded: 9999,
        logo: { teamLogo },
      },
      venue: {
        name: "Venue Name",
        city: "Venue City",
      },
    },
  ]);
  const router = useRouter();
  const paramId = router.query.id;

  // todo fetch Data running many times overwriting the data. Why??

  async function callFetches() {
    let array = [
      `https://api-football-v1.p.rapidapi.com/v3/teams/statistics?league=39&season=2022&team=${paramId}`,
      `https://api-football-v1.p.rapidapi.com/v3/standings?season=2022&team=${paramId}`,
      `https://api-football-v1.p.rapidapi.com/v3/teams?id=${paramId}`,
    ];
    const promises = array.map(async (val) => {
      const data = await fetchData(val);
      return data;
    });

    const results = await Promise.all(promises);

    results.map((val, index) => {
      if (index === 0) {
        changeStats(val.response);
        setWins(val.response.fixtures.wins.total);
        setDraws(val.response.fixtures.draws.total);
        setLoses(val.response.fixtures.loses.total);
      } else if (index === 1) {
        setRankingArray(val.response);
        lookForPos(val.response);
      } else {
        setTeamInfo(val.response);
        changeId(val.response[0].team.id);
        changeTeamName(val.response[0].team.name);
      }
    });
  }

  async function fetchData(url) {
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
      const result = await response.json();
      return result;
    } catch (error) {
      console.error(error);
    }
  }

  function toggleStatStatus() {
    if (statStatus === "teamPage_show__Sfksl") {
      setStatStatus(`${styles.hide}`);
    } else {
      setStatStatus(`${styles.show}`);
    }
  }

  function toggleDisplayStat(val) {
    if (val === "Close") {
      setDisplayStat(null);
      setStatStatus(`${styles.hide}`);
    } else if (val === displayStat) {
      setDisplayStat(null);
      setStatStatus(`${styles.hide}`);
    } else {
      setDisplayStat(val);
      setStatStatus(`${styles.show}`);
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

  useEffect(() => {
    changeHeader(true);
    lookForPos(rankingArray);
  }, []);

  useEffect(() => {
    // fetchData(paramId, 1);
    callFetches();
  }, [router]);

  return (
    <div className={`${styles.teamPage}`}>
      <Header />

      <img
        src={teamInfo[0].team.logo}
        alt="Team Logo"
        className={`${styles.teamLogo}`}
      />
      <div className={`${styles.marginBtn} ${styles.infoDiv}`}>
        <h2 className={styles.infoH2}>{teamInfo[0].venue.name}</h2>
        <h2 className={styles.infoH2}>{teamInfo[0].venue.city}</h2>
        <h2 className={styles.infoH2}>Founded: {teamInfo[0].team.founded}</h2>
      </div>

      <div>
        <table className={styles.table}>
          <thead>
            <tr>
              <th style={{ color: "rgb(8, 205, 8)" }}>Wins</th>
              <th style={{ color: "yellow" }}>Draws</th>
              <th style={{ color: "red" }}>Loses</th>
              <th>Total Points</th>
              <th>Pos</th>
            </tr>
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
              setStatStatus(`${styles.show}`);
              toggleDisplayStat("StatsTeam");
            }}
          >
            Stats
          </button>
          <button
            className={styles.moreBtn}
            onClick={() => {
              setStatStatus(`${styles.show}`);
              toggleDisplayStat("FixtureList");
            }}
          >
            Fixture List
          </button>
          <button
            className={styles.moreBtn}
            onClick={() => {
              setStatStatus(`${styles.show}`);
              toggleDisplayStat("Standings");
            }}
          >
            Standings
          </button>
          <button
            className={styles.moreBtn}
            onClick={() => {
              setStatStatus(`${styles.show}`);
              toggleDisplayStat("Roster");
            }}
          >
            Players
          </button>
          <div className={styles.seasonFormat}>
            <p>Season: </p>
          </div>
          <select
            name="seasonSelect"
            id="seasonSelect"
            className={`${styles.moreBtn} ${styles.select}`}
            onChange={(e) => {
              changeSeason(e.target.value);
              toggleDisplayStat("Close");
            }}
          >
            {seasonList.map((val, index) => {
              return (
                <option value={val.value} key={`${val.season}-${index}`}>
                  {val.season}
                </option>
              );
            })}
          </select>
        </div>
      </div>
      <div className={`${styles.statBox} ${statStatus}`}>
        {displayStat === null ? (
          ""
        ) : displayStat === "StatsTeam" ? (
          <StatsTeam />
        ) : displayStat === "FixtureList" ? (
          <FixtureList />
        ) : displayStat === "Standings" ? (
          <Standings />
        ) : displayStat === "Roster" ? (
          <Roster />
        ) : (
          "ERROR"
        )}
      </div>
    </div>
  );
}

export default TeamPage;
