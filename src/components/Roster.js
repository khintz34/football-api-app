import styles from "../styles/roster.module.css";
import { useState, useEffect } from "react";
import { useTeamStore } from "@/stores/teamStore";
import teamLogo from "../assets/teamLogo.jpg";

function Roster() {
  const teamId = useTeamStore((state) => state.id);
  const [roster, setRoster] = useState([
    {
      player: {
        name: "Name",
        firstname: "firstname",
        lastname: "lastname",
        nationality: "Nationality",
        age: "Age",
        photo: "",
      },
      statistics: [
        {
          games: {
            position: "Position",
            minutes: 0,
          },
          goals: {
            assists: 0,
            total: 0,
          },
        },
      ],
    },
  ]);

  //finish async calls

  async function callFetches() {
    let array = [1, 2, 3];
    const promises = array.map(async (val) => {
      const data = await fetchData(teamId, 2022, val);
      return data;
    });

    const results = await Promise.all(promises);

    let holdingArray = [];
    results.map((val) => {
      val.response.map((value) => {
        holdingArray.push(value);
      });
    });

    holdingArray.sort(
      (a, b) => b.statistics[0].games.minutes - a.statistics[0].games.minutes
    );

    setRoster(holdingArray);
  }

  async function fetchData(id, season, page) {
    const url = `https://api-football-v1.p.rapidapi.com/v3/players?team=${id}&league=39&season=${season}&page=${page}`;
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
      return result;
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    callFetches();
  }, []);

  return (
    <div className={styles.rosterContainer}>
      <table className={styles.tableCol}>
        <thead>
          <tr className={styles.thead}>
            <th> </th>
            <th className={styles.nameCol}>Name</th>
            <th className={styles.numCol}>Age</th>
            <th className={styles.nationCol}>Nationality</th>
            <th className={styles.posCol}>Position</th>
            <th className={styles.minsCol}>Minutes</th>
            <th className={styles.numCol}>Goals</th>
            <th className={styles.numCol}>Assists</th>
          </tr>
        </thead>
        <tbody>
          {roster.map((val, index) => {
            return (
              <tr
                key={`${val.player.lastname}-${index}-roster`}
                className={styles.playerContainer}
              >
                <td>
                  <img src={val.player.photo} alt="" className={styles.photo} />
                </td>
                <td className={styles.nameCol}>
                  {val.player.firstname} {val.player.lastname}
                </td>
                <td className={styles.numCol}>{val.player.age}</td>
                <td className={styles.nationCol}>{val.player.nationality}</td>
                <td className={styles.posCol}>
                  {val.statistics[0].games.position}
                </td>
                <td className={styles.minsCol}>
                  {val.statistics[0].games.minutes === null
                    ? 0
                    : val.statistics[0].games.minutes}
                </td>
                <td className={styles.numCol}>
                  {val.statistics[0].goals.total === null
                    ? 0
                    : val.statistics[0].goals.total}
                </td>
                <td className={styles.numCol}>
                  {val.statistics[0].goals.assists === null
                    ? 0
                    : val.statistics[0].goals.assists}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default Roster;
