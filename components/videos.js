import { useState, useMemo, useEffect } from "react";
import { VIDEOS } from "@/data/work";
import { getYouTubeIdFromURL } from "@/lib/utils";
import { CDN_URL } from "@/lib/constants";
import SprayText from "@/components/spray-text";
import styles from "@/styles/videos.module.scss";

function Videos() {
  const [selectedVideoIndex, setSelectedVideoIndex] = useState(0);
  const selectedVideo = useMemo(
    () => VIDEOS[selectedVideoIndex],
    [selectedVideoIndex]
  );

  useEffect(() => {
    const videoButton = document.getElementById(`select-${selectedVideoIndex}`);
    videoButton.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "center",
    });
  }, [selectedVideoIndex]);

  const selectNextOrPrevVideo = (next) => {
    setSelectedVideoIndex((selectedVideoIndex) => {
      let nextIndex = selectedVideoIndex + (next ? 1 : -1);
      if (nextIndex > VIDEOS.length - 1) {
        nextIndex = 0;
      }

      if (nextIndex < 0) {
        nextIndex = VIDEOS.length - 1;
      }

      return nextIndex;
    });
  };

  const onPointerEnter = (index) => {
    const videoButton = document.getElementById(`select-${index}`);

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

  return (
    <div className={styles.videos}>
      <div className={styles.title}>
        <SprayText text={selectedVideo.name} />
      </div>
      <button
        className={styles.previous}
        onClick={(event) => {
          event.stopPropagation();
          selectNextOrPrevVideo();
        }}
      >
        <img src={`${CDN_URL}/images/misc/arrow.png`} alt="Prev" />
      </button>
      <div className={styles["selected-video"]}>
        {selectedVideo.comingSoon ? (
          <div className={styles["coming-soon-video"]}>
            <div className={styles.text}>Coming Soon</div>
            <video autoPlay playsInline muted loop type="video/mp4">
              <source src={`${CDN_URL}/gifs/${selectedVideo.image}.mp4`} />
            </video>
          </div>
        ) : (
          <iframe
            key={selectedVideo.name}
            width={900}
            height={475}
            type="text/html"
            src={`https://www.youtube.com/embed/${getYouTubeIdFromURL(
              selectedVideo.url
            )}?autoplay=0&origin=https://mndlss.tv`}
            frameborder="0"
          />
        )}
      </div>
      <button
        className={styles.next}
        onClick={(event) => {
          event.stopPropagation();
          selectNextOrPrevVideo(true);
        }}
      >
        <img src={`${CDN_URL}/images/misc/arrow.png`} alt="Next" />
      </button>
      <div className={styles["video-scroller"]}>
        {VIDEOS.map((video, index) => {
          return (
            <button
              key={`select-${video.name}`}
              id={`select-${index}`}
              className={`${styles["video-scroller-option"]} ${
                index === selectedVideoIndex ? styles.selected : ""
              }`}
              onClick={() => setSelectedVideoIndex(index)}
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
