import styles from "../styles/playerStats.module.css";
import { useState, useEffect } from "react";
import { useTeamStore } from "@/stores/teamStore";
import teamLogo from "../assets/teamLogo.jpg";

function PlayerStats() {
  const teamId = useTeamStore((state) => state.id);

  async function callFetches() {
    fetchTopScoreData();
  }

  async function fetchTopScoreData(season) {
    const url =
      "https://api-football-v1.p.rapidapi.com/v3/players/topscorers?league=39&season=2020";
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
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    callFetches();
  }, []);

  return (
    <div className={styles.standingsContainer}>
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th></th>
            <th>Team</th>
            <th>Points</th>
            <th>Goal Dif</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((val, index) => {
            return (
              <tr key={`${val.team.name}-standings-tr`}>
                <td>{val.rank}</td>
                <td>
                  <img
                    src={val.team.logo}
                    alt="team logo"
                    className={styles.logo}
                  />
                </td>
                <td>{val.team.name}</td>
                <td>{val.points}</td>
                <td>{val.goalsDiff}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default PlayerStats;
