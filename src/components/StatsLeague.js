import Header from "@/components/header";
import Standings from "@/components/Standings";
import { useEffect, useState } from "react";
import styles from "../styles/leagueStats.module.css";
import { useTeamStore } from "@/stores/teamStore";

function StatsLeague({ list, title, stat, search }) {
  console.log(list, title, stat, search);
  return (
    <div>
      <div className={styles.leagueStatsDiv}>
        <div>
          <h2>{title}</h2>
          <div>
            <table>
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
                    <tr key={`${stat}-${index}-key`}>
                      <td>{val.player.photo}</td>
                      <td>{val.player.name}</td>
                      <td>{val.statistics[0].team.name}</td>
                      <td>{`${val.statistics[0]}.${search}.name`}</td>
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
