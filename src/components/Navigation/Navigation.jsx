import { NavLink } from "react-router";
import Styles from "./Navigation.module.css";

export default function Navigation() {
  return (
    <nav>
      <ul className={Styles.navList}>
        <li>
          <NavLink to="/">Home</NavLink>
        </li>
        <li>
          <NavLink to="/movies">Movies</NavLink>
        </li>
      </ul>
    </nav>
  );
}
