import Head from "next/head";
import Bump from "@/components/bump";
import styles from "@/styles/home.module.scss";

export default function HomePage() {
  return (
    <>
      <Head>
        <title>MNDLSS Pictures</title>
      </Head>
      <div id="home" className={styles.home}>
        <Bump />
        <button className={styles["reel-link"]}>/mndlss_reel</button>
      </div>
    </>
  );
}
