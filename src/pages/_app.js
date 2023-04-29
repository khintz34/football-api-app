import "@/styles/globals.css";
import { TeamInfoContext } from "../contexts/TeamInfoContext";
import { useState } from "react";

export default function App({ Component, pageProps }) {
  const [teamInfo, setTeamInfo] = useState("null");

  return <Component {...pageProps} />;
}

//  <TeamInfoContext.Provider value={{ teamInfo, setTeamInfo }}>
//     </TeamInfoContext.Provider>
