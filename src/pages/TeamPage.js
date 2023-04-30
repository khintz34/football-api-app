import { useTeamStore } from "@/stores/teamStore";
import { findTeam } from "./api/teams";
import { useEffect } from "react";
import styles from "../styles/teamPage.module.css";
import { GiHamburgerMenu } from "react-icons/gi";

function TeamPage() {
  const teamId = useTeamStore((state) => state.id);
  const teamTeam = useTeamStore((state) => state.team);
  const fullData = useTeamStore((state) => state.fullData);
  console.log(fullData);
  console.log(teamTeam);
  // need to get team info
  return (
    <div className={`${styles.teamPage}`}>
      <header className={`${styles.header}`}>
        <h1>{teamTeam.team.name}</h1>
        <div className={`${styles.menuBtn}`}>
          <GiHamburgerMenu />
        </div>
      </header>

      <img
        src={teamTeam.team.logo}
        alt="Team Logo"
        className={`${styles.teamLogo}`}
      />
      <h2>Venue: {teamTeam.venue.name}</h2>
      <div className={`${styles.buttonList}`}>
        <button>View Stats</button>
        <button>Fixture List</button>
        <button>Standings</button>
        <button>Roster</button>
      </div>
    </div>
  );
}

export default TeamPage;
