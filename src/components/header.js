import React from "react";
import styles from "../styles/Header.module.css";
import Link from "next/link";
import { GiHamburgerMenu } from "react-icons/gi";
import { useNavbarStore } from "@/stores/navbarStore";
import { useTeamStore } from "@/stores/teamStore";

const Header = () => {
  const navbarStatus = useNavbarStore((state) => state.navbarStatus);
  const changeStatus = useNavbarStore((state) => state.changeStatus);
  const team = useTeamStore((state) => state.team);

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
  return (
    <header className={`${styles.header}`}>
      <h1>
        <Link href={"/"}>{team.team.name}</Link>
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
          <Link href={"/workout"} className=" whiteFont">
            <li
              className={`${styles.headerBtn} ${styles.menuItem}`}
              onClick={closeMenu}
            >
              My Workout
            </li>
          </Link>
          <Link className=" whiteFont" href={"/options"}>
            <li
              className={`${styles.headerBtn} ${styles.menuItem}`}
              onClick={closeMenu}
            >
              Options{" "}
            </li>
          </Link>
        </ul>
      </div>
    </header>
  );
};

export default Header;
