import Header from "@/components/header";
import Standings from "@/components/Standings";
import { useEffect, useState } from "react";
import styles from "../styles/leagueStats.module.css";
import { useTeamStore } from "@/stores/teamStore";
import StatsLeague from "@/components/StatsLeague";

function LeagueStats() {
  const teamId = useTeamStore((state) => state.id);
  const [topScorers, setTopScorers] = useState([
    {
      player: {
        photo: "",
        name: "playerName",
      },
      statistics: [
        {
          team: { name: "teamName" },
          goals: { total: 100 },
        },
      ],
    },
  ]);
  const [topAssists, setTopAssists] = useState([]);
  const [topYellowCards, setTopYellowCards] = useState([]);
  const [topRedcards, setTopRedCards] = useState([]);

  async function callFetches() {
    fetchData(2022, "topscorers");
    fetchData(2022, "topassists");
    fetchData(2022, "topyellowcards");
    fetchData(2022, "topredcards");
  }

  async function fetchData(season, type) {
    const url = `https://api-football-v1.p.rapidapi.com/v3/players/${type}?league=39&season=${season}`;

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
      trimList(result.response, type);
    } catch (error) {
      console.error(error);
    }
  }

  function trimList(array, type) {
    let holdingArray = [];

    for (let i = 0; i < 10; i++) {
      holdingArray.push(array[i]);
    }

    switch (type) {
      case "topscorers":
        setTopScorers(holdingArray);
        break;
      case "topassists":
        setTopAssists(holdingArray);
        break;
      case "topyellowcards":
        setTopYellowCards(holdingArray);
        break;
      case "topredcards":
        setTopRedCards(holdingArray);
        break;
    }
  }

  useEffect(() => {
    callFetches();
  }, []);

  return (
    <div>
      <Header />
      <div className={styles.leagueStatsMain}>
        <StatsLeague list={topScorers} title="Most Goals" stat="Goals" />
        <StatsLeague list={topAssists} title="Most Assists" stat="Assists" />
        <StatsLeague
          list={topYellowCards}
          title="Most Yellow Cards"
          stat="Yellow Cards"
        />
        <StatsLeague
          list={topRedcards}
          title="Most Red Cards"
          stat="Red Cards"
        />
      </div>
    </div>
  );
}

export default LeagueStats;
