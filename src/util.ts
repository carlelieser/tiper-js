export const getRandomArbitrary = (min: number, max: number) => {
  return Math.random() * (max - min) + min;
};

export const delay = (ms: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}