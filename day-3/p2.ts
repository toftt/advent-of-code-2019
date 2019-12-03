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
const visited = new Map<string, number>();
const crossed: number[] = [];

let steps = 0;
wire1.forEach(({ distance, direction }) => {
  const str = () => `x${position[0]}y${position[1]}`;
  switch (direction) {
    case "D": {
      while (distance) {
        steps++;
        position[1]--;

        const s = str();

        if (!visited.has(s)) {
          visited.set(s, steps);
        }
        distance--;
      }
      break;
    }
    case "U": {
      while (distance) {
        steps++;
        position[1]++;

        const s = str();

        if (!visited.has(s)) {
          visited.set(s, steps);
        }
        distance--;
      }
      break;
    }
    case "R": {
      while (distance) {
        steps++;
        position[0]++;

        const s = str();

        if (!visited.has(s)) {
          visited.set(s, steps);
        }
        distance--;
      }
      break;
    }
    case "L": {
      while (distance) {
        steps++;
        position[0]--;

        const s = str();

        if (!visited.has(s)) {
          visited.set(s, steps);
        }
        distance--;
      }
      break;
    }
  }
});

steps = 0;
position[0] = 0;
position[1] = 0;

wire2.forEach(({ distance, direction }) => {
  const str = () => `x${position[0]}y${position[1]}`;
  switch (direction) {
    case "D": {
      while (distance) {
        steps++;
        position[1]--;
        const s = str();
        if (visited.has(s)) {
          const wire1Steps = visited.get(s);
          crossed.push(wire1Steps + steps);
        }

        distance--;
      }
      break;
    }
    case "U": {
      while (distance) {
        steps++;
        position[1]++;
        const s = str();
        if (visited.has(s)) {
          const wire1Steps = visited.get(s);
          crossed.push(wire1Steps + steps);
        }

        distance--;
      }
      break;
    }
    case "R": {
      while (distance) {
        steps++;
        position[0]++;
        const s = str();
        if (visited.has(s)) {
          const wire1Steps = visited.get(s);
          crossed.push(wire1Steps + steps);
        }

        distance--;
      }
      break;
    }
    case "L": {
      while (distance) {
        steps++;
        position[0]--;
        const s = str();
        if (visited.has(s)) {
          const wire1Steps = visited.get(s);
          crossed.push(wire1Steps + steps);
        }

        distance--;
      }
      break;
    }
  }
});


const solution = Math.min(...crossed);
console.log(solution);
