import { useState, useEffect } from "react";
import { VIDEOS } from "@/data/work";
import { CDN_URL } from "@/lib/constants";
import WatchButton from "@/components/watch-button";
import styles from "@/styles/videos.module.scss";

function Videos() {
  const [selectedVideoIndex, setSelectedVideoIndex] = useState(0);
  const selectedVideo = VIDEOS[selectedVideoIndex];

  useEffect(() => {
    const clearVideos = () => {
      document
        .querySelectorAll("animated")
        .forEach((element) => element.remove());
    };

    clearVideos();

    return () => {
      clearVideos();
    };
  }, []);

  const onSelectVideo = (index) => {
    setSelectedVideoIndex(index);
    const videoButton = document.getElementById(`video-${index}`);
    videoButton.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "center",
    });
  };

  const onPointerEnter = (index) => {
    const videoButton = document.getElementById(`video-${index}`);

    const previewVideo = document.createElement("video");

    previewVideo.id = `preview-video-${index}`;
    previewVideo.classList.add("animated");
    previewVideo.src = `${CDN_URL}/gifs/${VIDEOS[index].image}.mp4`;
    previewVideo.volume = 0;
    previewVideo.muted = true;
    previewVideo.loop = true;
    previewVideo.playsInline = true;
    previewVideo.play().catch(() => {
      // Do nothing
    });

    videoButton.appendChild(previewVideo);
  };

  const onPointerLeave = (index) => {
    const previewVideo = document.getElementById(`preview-video-${index}`);
    previewVideo?.remove();
  };

  const selectNextOrPrevVideo = (next) => {
    let nextIndex = selectedVideoIndex + (next ? 1 : -1);
    if (nextIndex > VIDEOS.length - 1) {
      nextIndex = 0;
    }

    if (nextIndex < 0) {
      nextIndex = VIDEOS.length - 1;
    }

    onSelectVideo(nextIndex);
  };

  return (
    <div className={styles.videos}>
      <div className={styles["selected-video"]}>
        <div className={styles["video-preview"]}>
          <button
            className={styles.previous}
            onClick={() => selectNextOrPrevVideo()}
          >
            <img src={`${CDN_URL}/images/misc/arrow.png`} alt="Prev" />
          </button>
          <img
            className={styles.vignette}
            src={`${CDN_URL}/images/misc/vignette.png`}
            alt=""
          />
          <video
            key={selectedVideo.image}
            className={styles.animated}
            autoPlay
            playsInline
            muted
            loop
          >
            <source
              src={`${CDN_URL}/gifs/${selectedVideo.image}.mp4`}
              type="video/mp4"
            />
          </video>
          <button
            className={styles.next}
            onClick={() => selectNextOrPrevVideo(true)}
          >
            <img src={`${CDN_URL}/images/misc/arrow.png`} alt="Next" />
          </button>
        </div>
        <div className={styles["video-info"]}>
          <div className={styles.name}>{selectedVideo.name}</div>
          <div className={styles.description}>{selectedVideo.description}</div>
          <div className={styles.watch}>
            <WatchButton url={selectedVideo.url} />
          </div>
        </div>
      </div>
      <div className={styles["video-scroller"]}>
        {VIDEOS.map((video, index) => {
          return (
            <button
              id={`video-${index}`}
              className={`${styles.video} ${
                selectedVideoIndex === index ? styles.selected : ""
              }`}
              key={video.name}
              onClick={() => onSelectVideo(index)}
              onPointerEnter={() => onPointerEnter(index)}
              onPointerLeave={() => onPointerLeave(index)}
            >
              <img
                className={styles.vignette}
                src={`${CDN_URL}/images/misc/vignette.png`}
                alt=""
              />
              <img
                className={styles.still}
                src={`${CDN_URL}/gifs/stills/${video.image}.png`}
                alt=""
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default Videos;
