import Map from "../components/Map";
import SideBar from "../components/SideBar";
import User from "../components/User";
import { CitiesProvider } from "../contexts/CitiesContext";
import styles from "./AppLayout.module.css";

function AppLayout() {
  return (
    <CitiesProvider>
      <div className={styles.app}>
        <SideBar />
        <Map />
        <User />
      </div>
    </CitiesProvider>
  );
}

export default AppLayout;
