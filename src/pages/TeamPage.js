import { useTeamStore } from "@/stores/teamStore";
import { findTeam } from "./api/teams";
import { useEffect } from "react";

function TeamPage() {
  const teamId = useTeamStore((state) => state.id);
  const teamTeam = useTeamStore((state) => state.team);
  // need to get team info
  return <div>{teamId}</div>;
}

export default TeamPage;
