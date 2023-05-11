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
        nationality: "Nationality",
        age: "Age",
        photo: "",
      },
      statistics: {
        games: {
          appearances: 0,
          position: "Position",
          minutes: 0,
        },
        goals: {
          assists: 0,
          total: 0,
        },
      },
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

    console.log("promise.all");

    console.log(results);

    let holdingArray = [];
    results.map((val) => {
      console.log(val.response);
      val.response.map((value) => {
        holdingArray.push(value);
      });
    });

    console.log("HoldingAeeay: ", holdingArray);
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
      console.log(result);
      return result;
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    // fetchData(teamId, 2022, 1);
    callFetches();
  }, []);

  return (
    <div>
      {roster.map((val, index) => {
        <div key={`${val.player.lastname}-${index}-roster`}>
          <p>{val.player.lastname}</p>
        </div>;
      })}
    </div>
  );
}

export default Roster;
