import styles from "../styles/fixtureList.module.css";
import { useState, useEffect } from "react";
import { useTeamStore } from "@/stores/teamStore";
import { calculateOverrideValues } from "next/dist/server/font-utils";

function FixtureList() {
  const teamId = useTeamStore((state) => state.id);
  const teamData = useTeamStore((state) => state.team);
  const seasonId = useTeamStore((state) => state.season);
  let currentleague = "";
  const [fixtureList, setFixtureList] = useState([
    {
      goals: { home: 0, away: 0 },

      teams: {
        home: { name: "teamName", logo: "" },
        away: { name: "teamName2", logo: "" },
      },
      league: { name: "League Name" },
    },
  ]);
  async function fetchData(id, season) {
    const url = `https://api-football-v1.p.rapidapi.com/v3/fixtures?season=${season}&team=${id}`;
    const options = {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": "52e45221aamsh291d365e94c68ecp10cee2jsn6c88101151c8",
        "X-RapidAPI-Host": "api-football-v1.p.rapidapi.com",
      },
    };

    try {
      const response = await fetch(url, options);
      const result = await response.json();

      let array = result.response;
      array.sort((a, b) =>
        a.league.anme > b.league.name
          ? 1
          : b.league.name > a.league.name
          ? -1
          : 0
      );

      setFixtureList(array);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchData(teamId, seasonId);
  }, []);

  return (
    <div className={styles.fixtureMain}>
      {fixtureList.map((val, index) => {
        let homeTeam = false;
        let showLeague = false;
        if (val.teams.home.name === teamData.team.name) {
          homeTeam = true;
        } else {
          homeTeam = false;
        }

        if (val.league.name !== currentleague) {
          showLeague = true;
          currentleague = val.league.name;
        }
        return (
          <div key={`${val.teams.home.name}-${teamId}-${index}`}>
            <div className={styles.leagueName}>
              {showLeague ? <h2>{val.league.name}</h2> : ""}
            </div>
            <div className={styles.fixtureContainer}>
              <img src={val.teams.home.logo} alt="" className={styles.logo} />
              <p className={styles.teamName}>{val.teams.home.name}</p>
              <p
                className={
                  val.teams.home.winner && homeTeam
                    ? styles.winner
                    : val.teams.away.winner && !homeTeam
                    ? styles.winner
                    : val.teams.home.winner === null
                    ? styles.draw
                    : styles.loser
                }
              >
                {val.goals.home}
              </p>
              <p> - </p>
              <p
                className={
                  val.teams.away.winner && !homeTeam
                    ? styles.winner
                    : val.teams.home.winner && homeTeam
                    ? styles.winner
                    : val.teams.home.winner === null
                    ? styles.draw
                    : styles.loser
                }
              >
                {val.goals.away}
              </p>
              <p className={styles.teamName}>{val.teams.away.name}</p>
              <img src={val.teams.away.logo} alt="" className={styles.logo} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default FixtureList;
