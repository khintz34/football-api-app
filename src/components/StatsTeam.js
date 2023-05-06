import styles from "../styles/statsTeam.module.css";
import { useState, useEffect } from "react";
import { useTeamStore } from "@/stores/teamStore";

function StatsTeam(props) {
  const [yellowCards, setYellowCards] = useState(0);
  const [redCards, setRedCards] = useState(0);
  const [currentForm, setCurrentForm] = useState("");
  const [againstLeast, setAgainstLeast] = useState([
    "placeholder",
    { total: 0, percentage: 0 },
  ]);
  const [againstMost, setAgainstMost] = useState([
    0,
    { total: 0, percentage: 0 },
  ]);
  const [forLeast, setForLeast] = useState([0, { total: 0, percentage: 0 }]);
  const [forMost, setForMost] = useState([0, { total: 0, percentage: 0 }]);
  const changeTeamStats = useTeamStore((state) => state.changeTeamStats);
  const teamId = useTeamStore((state) => state.id);
  const [statStatus, setStatStatus] = useState("styles.hide");
  const teamStats = useTeamStore((state) => state.teamStats);
  const [statsFound, setStatsFound] = useState(false);
  const [cleanSheets, setCleanSheets] = useState(0);
  const [failedToScoreAway, setFailedToScoreAway] = useState(0);
  const [failedToScoreHome, setFailedToScoreHome] = useState(0);
  const [formation, setFormation] = useState("");
  const [penaltyMiss, setPenaltyMiss] = useState({ percentage: 0, total: 0 });
  const [penaltyMake, setPenaltyMake] = useState({ percentage: 0, total: 0 });
  const [goalsAgainst, setGoalsAgainst] = useState({
    away: 0,
    home: 0,
    total: 0,
  });
  const [goalsFor, setGoalsFor] = useState({
    away: 0,
    home: 0,
    total: 0,
  });

  async function findStats(id, season) {
    const url = `https://api-football-v1.p.rapidapi.com/v3/teams/statistics?league=39&season=${season}&team=${id}`;
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
      const teamStatsAwait = await changeTeamStats(result.response);
      console.log(result.response);
      calcCards(result.response.cards);
      calcGoals(result.response.goals);
      setCleanSheets(result.response.clean_sheet.total);
      setStatsFound(true);
      setFailedToScoreAway(result.response.failed_to_score.away);
      setFailedToScoreHome(result.response.failed_to_score.home);
      setFormation(result.response.lineups[0].formation);
      setPenaltyMake(result.response.penalty.scored);
      setPenaltyMiss(result.response.penalty.missed);
      setGoalsAgainst(result.response.goals.against.total);
      setGoalsFor(result.response.goals.for.total);
      return result;
    } catch (error) {
      console.error(error);
    }
  }

  function calcCards(data) {
    let yellow = 0;
    const yellowArray = Object.entries(data.yellow);
    yellowArray.map((val) => {
      yellow += val[1].total;
    });
    setYellowCards(yellow);

    let red = 0;
    const redArray = Object.entries(data.red);
    redArray.map((val) => {
      red += val[1].total;
    });
    setRedCards(red);

    let formHold = teamStats.form;
    console.log(formHold);
    setCurrentForm(formHold.substring(0, 5));
  }

  function calcGoals(data) {
    //calc away goals against
    let againstArray = Object.entries(data.against.minute);
    let againstMostHold = againstArray[0];
    let againstLeastHold = againstArray[0];

    for (let i = 0; i < 6; i++) {
      if (againstArray[i][1].total < againstLeastHold[1].total) {
        againstLeastHold = againstArray[i];
      } else if (againstArray[i][1].total > againstMostHold[1].total) {
        againstMostHold = againstArray[i];
      }
    }
    setAgainstLeast(againstLeastHold);
    setAgainstMost(againstMostHold);

    //calc home goals against
    let forArray = Object.entries(data.for.minute);
    let forMostHold = forArray[0];
    let forLeastHold = forArray[0];

    for (let i = 0; i < 6; i++) {
      if (forArray[i][1].total < forLeastHold[1].total) {
        forLeastHold = forArray[i];
      } else if (forArray[i][1].total > forMostHold[1].total) {
        forMostHold = forArray[i];
      }
    }
    setForLeast(forLeastHold);
    setForMost(forMostHold);
  }

  useEffect(() => {
    if (!statsFound) {
      findStats(teamId, 2022);
    }
  }, []);

  return (
    <div className={`${styles.statBox} ${statStatus}`}>
      <div>Yellow Cards: {yellowCards}</div>
      <div>Red Cards: {redCards}</div>
      <div>Clean Sheets: {cleanSheets}</div>
      <div>
        Failed to Score: {failedToScoreAway} (A){""}
        {failedToScoreHome} (H)
        {failedToScoreHome + failedToScoreAway} (Total)
      </div>
      <div>Form: {currentForm}</div>
      <div>Most Common Formation: {formation}</div>
      <div>
        Penalty Miss: {penaltyMiss.percentage}({penaltyMiss.total})
      </div>
      <div>
        Penalty Scored: {penaltyMake.percentage}({penaltyMake.total})
      </div>
      <div>
        <h3>Defence</h3>
        <div>
          Goals Allowed:
          {goalsAgainst.away} (A){""}
          {goalsAgainst.home}(H)
          {goalsAgainst.total} (Total)
        </div>
        <div>
          Most Likely Time To Give Up A Goal:
          {againstMost[0]} : {againstMost[1].total} ({againstMost[1].percentage}
          )
        </div>
        <div>
          Least Likely Time To Give Up A Goal:
          {againstLeast[0]} : {againstLeast[1].total} (
          {againstLeast[1].percentage})
        </div>
        <div>
          <h3>Offense</h3>
          <div>
            Goals Allowed:
            {goalsFor.away} (A){""}
            {goalsFor.home}(H)
            {goalsFor.total} (Total)
          </div>
          <div>
            Most Likely Time To Score A Goal:
            {forMost[0]} : {forMost[1].total} ({forMost[1].percentage})
          </div>

          <div>
            Least Likely Time To Score A Goal:
            {forLeast[0]} : {forLeast[1].total} ({forLeast[1].percentage})
          </div>
        </div>
      </div>
    </div>
  );
}

export default StatsTeam;
