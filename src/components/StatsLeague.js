import Header from "@/components/header";
import Standings from "@/components/Standings";
import { useEffect, useState } from "react";
import styles from "../styles/leagueStats.module.css";
import { useTeamStore } from "@/stores/teamStore";

function StatsLeague({ list, title, stat }) {
  return (
    <div>
      <div className={styles.leagueStatsDiv}>
        <div>
          <h2 className={styles.statTitle}>{title}</h2>
          <div>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th></th>
                  <th>Name</th>
                  <th>Club</th>
                  <th>{stat}</th>
                </tr>
              </thead>
              <tbody>
                {list.map((val, index) => {
                  return (
                    <tr key={`${stat}-${index}-key`} className={styles.center}>
                      <td>
                        <img
                          src={val.player.photo}
                          alt=""
                          className={styles.photo}
                        />
                      </td>
                      <td>{val.player.name}</td>
                      <td>{val.statistics[0].team.name}</td>
                      {stat === "Goals" ? (
                        <td>{`${val.statistics[0].goals.total}`}</td>
                      ) : stat === "Assists" ? (
                        <td>{`${val.statistics[0].goals.assists}`}</td>
                      ) : stat === "Yellow Cards" ? (
                        <td>{`${val.statistics[0].cards.yellow}`}</td>
                      ) : (
                        <td>{`${val.statistics[0].cards.red}`}</td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StatsLeague;
