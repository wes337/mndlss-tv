export function getRandomInt(min, max) {
  const minCeil = Math.ceil(min);
  const maxFloor = Math.floor(max);

  return Math.floor(Math.random() * (maxFloor - minCeil + 1)) + minCeil;
}

export function eventTargetInsideElementTag(
  event,
  tags = ["button", "a", "input", "iframe"]
) {
  let targetElement = event.target;

  while (targetElement != null) {
    if (tags.includes(targetElement.nodeName.toLowerCase())) {
      return true;
    }

    targetElement = targetElement.parentNode;
  }

  return false;
}

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function getPriceInUSD(amount) {
  return currencyFormatter.format(amount);
}

export function getYouTubeIdFromURL(url) {
  if (!url) {
    return null;
  }

  const urlParts = url.split("?v=");
  return urlParts[urlParts.length - 1];
}

export function preloadUrl(url) {
  if (typeof window === "undefined") {
    return;
  }

  const id = `preload-${url.replace(/\//g, "")}`;
  const alreadyPreloaded = document.getElementById(id);

  if (alreadyPreloaded) {
    return;
  }

  const BASE_URL = `${window.location.protocol}//${window.location.host}`;
  const link = document.createElement("link");
  link.id = id;
  link.rel = "prefetch";
  link.href = url[0] === "/" ? `${BASE_URL}${url}` : url;
  document.head.appendChild(link);
}

export function preloadUrls(urls) {
  urls.forEach((url) => preloadUrl(url));
}
