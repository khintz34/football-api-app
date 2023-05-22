import styles from "../styles/standings.module.css";
import { useState, useEffect } from "react";
import { useTeamStore } from "@/stores/teamStore";
import teamLogo from "../assets/teamLogo.jpg";

function Standings(props) {
  const teamId = useTeamStore((state) => state.id);
  const [standings, setStandings] = useState([
    {
      rank: 1,
      points: 100,
      team: {
        name: "Team name",
        logo: "../assets/teamLogo.jpg",
      },
      goalsDiff: 100,
    },
  ]);
  async function fetchData(season) {
    const url = `https://api-football-v1.p.rapidapi.com/v3/standings?season=${season}&league=39`;
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
      console.log(result.response);
      setStandings(result.response[0].league.standings[0]);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchData(2022);
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
            console.log(val);
            return (
              <tr
                key={`${val.team.name}-standings-tr`}
                className={val.team.id === teamId ? styles.selectedTeam : ""}
              >
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

export default Standings;
