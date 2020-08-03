export const getRandomArbitrary = (min: number, max: number) => {
  return Math.random() * (max - min) + min;
}

export const createSpan = (className: string) => {
  const el = document.createElement("span");
  el.className = className;
  return el;
}

export const delay = (ms: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
