const fs = require("fs");

type Direction = "R" | "L" | "D" | "U";

const input = fs.readFileSync("day-3/input", "utf8");
const wire1: { direction: Direction; distance: number }[] = input
  .split("\n")[0]
  .split(",")
  .map(x => ({ direction: x[0], distance: Number(x.slice(1)) }));
const wire2: { direction: Direction; distance: number }[] = input
  .split("\n")[1]
  .split(",")
  .map(x => ({ direction: x[0], distance: Number(x.slice(1)) }));

const position = [0, 0];
const visited = new Set();
const crossed = [];

wire1.forEach(({ distance, direction }) => {
  const str = () => `x${position[0]}y${position[1]}`;
  switch (direction) {
    case "D": {
      while (distance) {
        position[1]--;

        visited.add(str());
        distance--;
      }
      break;
    }
    case "U": {
      while (distance) {
        position[1]++;

        visited.add(str());
        distance--;
      }
      break;
    }
    case "R": {
      while (distance) {
        position[0]++;

        visited.add(str());
        distance--;
      }
      break;
    }
    case "L": {
      while (distance) {
        position[0]--;

        visited.add(str());
        distance--;
      }
      break;
    }
  }
});

position[0] = 0;
position[1] = 0;

wire2.forEach(({ distance, direction }) => {
  const str = () => `x${position[0]}y${position[1]}`;
  switch (direction) {
    case "D": {
      while (distance) {
        position[1]--;
        const s = str();
        if (visited.has(s)) crossed.push([...position]);

        distance--;
      }
      break;
    }
    case "U": {
      while (distance) {
        position[1]++;
        const s = str();
        if (visited.has(s)) crossed.push([...position]);

        distance--;
      }
      break;
    }
    case "R": {
      while (distance) {
        position[0]++;
        const s = str();
        if (visited.has(s)) crossed.push([...position]);

        distance--;
      }
      break;
    }
    case "L": {
      while (distance) {
        position[0]--;
        const s = str();
        if (visited.has(s)) crossed.push([...position]);

        distance--;
      }
      break;
    }
  }
});

let min = Infinity;
crossed.forEach(x => {
  const dist = Math.abs(x[0]) + Math.abs(x[1]);
  if (dist < min) min = dist;
});

console.log(min);
