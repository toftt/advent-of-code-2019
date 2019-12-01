const fs = require("fs");

const massToFuel = (mass: number) => {
  const fuel = Math.floor(mass / 3) - 2;
  if (fuel < 0) return 0;
  return fuel + massToFuel(fuel);
};

const input = fs.readFileSync("day-1/p1.input", "utf8");
const massList = input
  .split("\n")
  .filter(Boolean)
  .map(Number);

const solution = massList
  .map(massToFuel)
  .reduce((acc: number, n: number) => acc + n, 0);

console.log(solution);
