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
        <a
          className={styles["reel-link"]}
          href="https://www.youtube.com/watch?v=-Yd_SSoNgM0"
          target="_blank"
          rel="noopener noreferrer"
        >
          /mndlss_reel
        </a>
      </div>
    </>
  );
}
