import styles from "../styles/statsTeam.module.css";
import { useState, useEffect } from "react";
import { useTeamStore } from "@/stores/teamStore";

function StatsTeam(props) {
  const [yellowCards, setYellowCards] = useState(0);
  const [redCards, setRedCards] = useState(0);
  const [currentForm, setCurrentForm] = useState("");
  const [againstLeast, setAgainstLeast] = useState([
    0,
    { total: 0, percentage: 0 },
  ]);
  const [againstMost, setAgainstMost] = useState([
    0,
    { total: 0, percentage: 0 },
  ]);
  const [forLeast, setForLeast] = useState([0, { total: 0, percentage: 0 }]);
  const [forMost, setForMost] = useState([0, { total: 0, percentage: 0 }]);
  const changeTeamStats = useTeamStore((state) => state.changeTeamStats);
  const seasonId = useTeamStore((state) => state.season);
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
    setCurrentForm(formHold.slice(-5).split("").reverse().join(""));
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
      findStats(teamId, seasonId);
    }
  }, []);

  return (
    <div className={`${styles.statBox}`}>
      <div>
        <h2 className={`${styles.center} ${styles.grey}`}>Team Stats</h2>
        <table className={styles.tableStat}>
          <thead>
            <tr>
              <th style={{ color: "yellow" }}>Yellow Cards</th>
              <th style={{ color: "red" }}>Red Cards</th>
              <th>Clean Sheets</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ color: "yellow" }}>{yellowCards}</td>
              <td style={{ color: "red" }}>{redCards}</td>
              <td>{cleanSheets}</td>
            </tr>
          </tbody>
        </table>
        <table className={styles.tableStat}>
          <thead>
            <tr>
              <th>Current Form</th>
              <th>Most Used Formation</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{currentForm}</td>
              <td>{formation}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div>
        <h2 className={`${styles.center} ${styles.grey}`}>Defence</h2>
        <table className={`${styles.tableStat} ${styles.tableUnderline}`}>
          <caption className={styles.caption}>Goals Allowed</caption>
          <thead>
            <tr>
              <th>Home</th>
              <th>Away</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{goalsAgainst.home}</td>
              <td> {goalsAgainst.away}</td>
              <td>{goalsAgainst.total}</td>
            </tr>
          </tbody>
        </table>

        {/* //! comment this out */}

        <table className={`${styles.tableStat} ${styles.tableUnderline}`}>
          <caption className={styles.caption}>
            Most Likely Time To Give Up A Goal
          </caption>
          <thead>
            <tr>
              <th>Minutes</th>
              <th>Goals</th>
              <th>%</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td> {againstMost[0]} </td>
              <td> {againstMost[1].total} </td>
              <td>{againstMost[1].percentage}</td>
            </tr>
          </tbody>
        </table>

        <table className={`${styles.tableStat} ${styles.tableUnderline}`}>
          <caption className={styles.caption}>
            Least Likely Time To Give Up A Goal
          </caption>
          <thead>
            <tr>
              <th>Minutes</th>
              <th>Goals</th>
              <th>%</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td> {againstLeast[0]} </td>
              <td> {againstLeast[1].total} </td>
              <td>{againstLeast[1].percentage}</td>
            </tr>
          </tbody>
        </table>

        <div>
          <h2 className={`${styles.center} ${styles.grey}`}>Offense</h2>
          <table className={`${styles.tableStat} ${styles.tableUnderline}`}>
            <caption className={styles.caption}>Goals Scored</caption>
            <thead>
              <tr>
                <th>Home</th>
                <th>Away</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{goalsFor.home}</td>
                <td> {goalsFor.away}</td>
                <td>{goalsFor.total}</td>
              </tr>
            </tbody>
          </table>

          <table className={`${styles.tableStat} ${styles.tableUnderline}`}>
            <caption className={styles.caption}>
              Most Likely Time To Score A Goal
            </caption>
            <thead>
              <tr>
                <th>Minutes</th>
                <th>Goals</th>
                <th>%</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td> {forMost[0]} </td>
                <td> {forMost[1].total} </td>
                <td>{forMost[1].percentage}</td>
              </tr>
            </tbody>
          </table>

          <table className={`${styles.tableStat} ${styles.tableUnderline}`}>
            <caption className={styles.caption}>
              Least Likely Time To Score A Goal
            </caption>
            <thead>
              <tr>
                <th>Minutes</th>
                <th>Goals</th>
                <th>%</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td> {forLeast[0]} </td>
                <td> {forLeast[1].total} </td>
                <td>{forLeast[1].percentage}</td>
              </tr>
            </tbody>
          </table>

          <table className={`${styles.tableStat} ${styles.tableUnderline}`}>
            <caption className={styles.caption}>Failed to Score</caption>
            <thead>
              <tr>
                <th>Away</th>
                <th>Home</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{failedToScoreAway} </td>
                <td> {failedToScoreHome}</td>
                <td> {failedToScoreHome + failedToScoreAway}</td>
              </tr>
            </tbody>
          </table>

          <table className={styles.tableStat}>
            <thead>
              <tr>
                <th>Penalty Miss</th>
                <th>Penalty Scored</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  {penaltyMiss.percentage}({penaltyMiss.total})
                </td>
                <td>
                  {penaltyMake.percentage}({penaltyMake.total})
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default StatsTeam;
