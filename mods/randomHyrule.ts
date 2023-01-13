export default function getRandomRarity() {
  const nbRandom = Math.floor(Math.random() * (100 - 1) + 1);
  if (nbRandom <= 50) { return 1; }
  if (nbRandom <= 80) { return 2; }
  if (nbRandom <= 95) { return 3; }
  if (nbRandom <= 99) { return 4; }
  if (nbRandom === 100) { return 5; }
  return 0;
}
