export function getRandomInt(min, max) {
  const minCeil = Math.ceil(min);
  const maxFloor = Math.floor(max);

  return Math.floor(Math.random() * (maxFloor - minCeil + 1)) + minCeil;
}

export function eventTargetInsideButtonOrATag(event) {
  let targetElement = event.target;

  while (targetElement != null) {
    if (
      targetElement.nodeName.toLowerCase() === "button" ||
      targetElement.nodeName.toLowerCase() === "a" ||
      targetElement.nodeName.toLowerCase() === "input"
    ) {
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
