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
