import styles from "../styles/fixtureList.module.css";
import { useState, useEffect } from "react";
import { useTeamStore } from "@/stores/teamStore";

function FixtureList() {
  const teamId = useTeamStore((state) => state.id);
  const [fixtureList, setFixtureList] = useState([
    {
      teams: {
        home: "Team",
        away: "Team2",
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
    fetchData(teamId, 2022);
  });

  return (
    <div>
      {fixtureList.map((val) => {
        <p>{val.teams.home.name}</p>;
      })}
    </div>
  );
}

export default FixtureList;
