import Head from "next/head";
import Videos from "@/components/videos";
import { CDN_URL } from "@/lib/constants";
import styles from "@/styles/work.module.scss";

function Work() {
  return (
    <>
      <Head>
        <title>MNDLSS Pictures - Work</title>
      </Head>
      <div className={styles.work}>
        <Videos />
        <video
          className={styles["work-backdrop"]}
          loop
          muted
          playsInline
          autoPlay
        >
          <source
            src={`${CDN_URL}/videos/old-video-comp.mp4`}
            type="video/mp4"
          />
        </video>
      </div>
    </>
  );
}

export default Work;
