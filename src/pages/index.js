import Head from "next/head";
import Image from "next/image";
import styles from "@/styles/Home.module.css";
import { useEffect, useState } from "react";
import { findTeam } from "./api/teams";
import Link from "next/link";
import { useTeamStore } from "@/stores/teamStore";
import Header from "@/components/header";

export default function Home() {
  const [teamList, setTeamList] = useState([]);
  const changeId = useTeamStore((state) => state.changeId);
  const changeTeam = useTeamStore((state) => state.changeTeam);
  const changeFullData = useTeamStore((state) => state.changeFullData);
  const changeHeader = useTeamStore((state) => state.changeHeader);
  async function getData() {
    const url =
      "https://api-football-v1.p.rapidapi.com/v3/teams?league=39&season=2020";

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
      createTeamList(result.response);
      changeFullData(result.response);
    } catch (error) {
      console.error(error);
    }
  }

  function createTeamList(list) {
    let array = [];
    list.map((val) => {
      array.push(val);
    });
    array.sort();
    setTeamList(array);
  }

  useEffect(() => {
    // getData();
    changeHeader(false);
  }, []);
  return (
    <>
      <Head>
        <title>Football Stats App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Header />
      <main className={`${styles.main}`}>
        <button onClick={getData}>See Teams</button>
        {teamList.map((val, index) => {
          return (
            <div
              key={`${val.team.id}-teamList`}
              onClick={() => {
                // findTeam(val.id);
                changeId(val.team.id);
                changeTeam(val);
              }}
            >
              <Link href={"/TeamPage"}>{val.team.name}</Link>
            </div>
          );
        })}
      </main>
    </>
  );
}
