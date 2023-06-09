import React from "react";
import styles from "../styles/Header.module.css";
import Link from "next/link";
import { GiHamburgerMenu } from "react-icons/gi";
import { useNavbarStore } from "@/stores/navbarStore";
import { useTeamStore } from "@/stores/teamStore";
import { useEffect, useState } from "react";

const Header = () => {
  const navbarStatus = useNavbarStore((state) => state.navbarStatus);
  const changeStatus = useNavbarStore((state) => state.changeStatus);
  const team = useTeamStore((state) => state.team);
  const header = useTeamStore((state) => state.header);
  const changeHeader = useTeamStore((state) => state.changeHeader);
  const teamName = useTeamStore((state) => state.teamName);

  const handleToggle = () => {
    if (navbarStatus === true) {
      changeStatus(false);
    } else {
      changeStatus(true);
    }
  };

  const closeMenu = () => {
    changeStatus(false);
  };

  const resetTeamInfo = () => {
    changeHeader(false);
  };

  return (
    <header className={`${styles.header}`}>
      <h1 onClick={resetTeamInfo}>
        <Link href={"/"}>{header ? teamName : "EPL Team Tracker"}</Link>
      </h1>

      <div className={styles.keepRight}>
        {navbarStatus === false ? (
          <div className={`${styles.menuBtn}`}>
            <GiHamburgerMenu onClick={handleToggle} />
          </div>
        ) : (
          <div onClick={handleToggle} className={`${styles.xBtnContainer}`}>
            <div
              className={`${styles.iconWidth} ${styles.openBtn} ${styles.xBtn}`}
            >
              X
            </div>
          </div>
        )}
      </div>

      <div className={styles.sideNav}>
        <ul
          className={`${styles.menuNav} ${
            navbarStatus === true ? `${styles.showMenu}` : `${styles.hideNav}`
          }`}
        >
          <Link href={"/"} className=" whiteFont">
            <li
              className={`${styles.headerBtn} ${styles.menuItem}`}
              onClick={closeMenu}
            >
              Home
            </li>
          </Link>
          <Link href={"/LeagueStandings"} className=" whiteFont">
            <li
              className={`${styles.headerBtn} ${styles.menuItem}`}
              onClick={closeMenu}
            >
              League Standings
            </li>
          </Link>
          <Link className=" whiteFont" href={"/LeagueStats"}>
            <li
              className={`${styles.headerBtn} ${styles.menuItem}`}
              onClick={closeMenu}
            >
              League Stats
            </li>
          </Link>
        </ul>
      </div>
    </header>
  );
};

export default Header;
