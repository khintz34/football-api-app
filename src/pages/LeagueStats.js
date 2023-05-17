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
    },
    {
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
    // let array = ["topscorers", "topassists", "topyellowcards", "topredcards"];
    // const promises = array.map(async (val) => {
    //   const data = await fetchData(2022, val);
    //   return data;
    // });
    fetchData(2022, "topscorers");
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
      // console.log(result);
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

    console.log(type, holdingArray);

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
        <StatsLeague
          list={topScorers}
          title="Top Scorers"
          stat="Goals"
          search="goals"
        />
      </div>
    </div>
  );
}

export default LeagueStats;
