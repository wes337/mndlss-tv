import { CDN_URL } from "@/lib/constants";
import { getPriceInUSD } from "@/lib/utils";
import useSpray from "@/hooks/spray";
import styles from "@/styles/product-card.module.scss";

function ProductCard({ title, image, price, onClick }) {
  const { spray, startSprayInterval, stopSprayInterval } = useSpray();

  return (
    <button
      className={styles["product-card"]}
      onClick={onClick}
      onPointerEnter={startSprayInterval}
      onPointerLeave={stopSprayInterval}
    >
      <img
        className={styles["product-card-image"]}
        src={`${CDN_URL}/images/shop/${image}`}
        alt=""
      />
      <div className={styles["product-card-title"]}>
        {title}
        <img
          className={styles.spray}
          key={spray}
          src={`${CDN_URL}/images/misc/spray-${spray}.png`}
          alt=""
        />
      </div>
      <div className={styles["product-card-price"]}>{getPriceInUSD(price)}</div>
    </button>
  );
}

export default ProductCard;
