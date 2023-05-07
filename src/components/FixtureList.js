import styles from "../styles/fixtureList.module.css";
import { useState, useEffect } from "react";
import { useTeamStore } from "@/stores/teamStore";

function FixtureList() {
  const teamId = useTeamStore((state) => state.id);
  const [fixtureList, setFixtureList] = useState([
    {
      goals: { home: 0, away: 0 },

      teams: {
        home: { name: "teamName", logo: "" },
        away: { name: "teamName2", logo: "" },
      },
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
      console.log(result);
      setFixtureList(result.response);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    console.log(fixtureList);
  }, [fixtureList]);

  useEffect(() => {
    fetchData(teamId, 2022);
  }, []);

  return (
    <div>
      {fixtureList.map((val, index) => {
        return (
          <div
            key={`${val.teams.home.name}-${teamId}-${index}`}
            className={styles.fixtureContainer}
          >
            <img src={val.teams.home.logo} alt="" className={styles.logo} />
            <p>{val.teams.home.name}</p>
            <p
              className={
                val.teams.home.winner
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
                val.teams.home.winner
                  ? styles.winner
                  : val.teams.home.winner === null
                  ? styles.draw
                  : styles.loser
              }
            >
              {val.goals.away}
            </p>
            <p>{val.teams.away.name}</p>
            <img src={val.teams.away.logo} alt="" className={styles.logo} />
          </div>
        );
      })}
    </div>
  );
}

export default FixtureList;
