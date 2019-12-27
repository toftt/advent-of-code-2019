export {};
import { readFileSync } from "fs";
import { IntCode } from "../common/IntCode";

type Direction = 1n | 2n | 3n | 4n;
const ALL_DIRECTIONS: Direction[] = [1n, 2n, 3n, 4n];

const getOppositeDirection = (direction: Direction) => {
  if (direction % 2n === 0n) return direction - 1n;
  return direction + 1n;
};

const getCoords = (path: Direction[]) => {
  let y = 0n;
  let x = 0n;

  path.forEach(direction => {
    switch (direction) {
      case 1n:
        y -= 1n;
        break;
      case 2n:
        y += 1n;
        break;
      case 3n:
        x -= 1n;
        break;
      case 4n:
        x += 1n;
        break;
    }
  });
  return `${x}x${y}y`;
};

const expr = /(-?\d+)x(-?\d+)y/;
const getAdjCoords = (coords: string) => {
  const [x, y] = coords
    .match(expr)
    .slice(1)
    .map(Number);

  return [
    { x: x + 1, y },
    { x: x - 1, y },
    { x, y: y + 1 },
    { x, y: y - 1 }
  ].map(p => `${p.x}x${p.y}y`);
};

const program = readFileSync("day-15/input", "utf8")
  .trim()
  .split(",");
const i = new IntCode(program);

const queue: Direction[][] = [[1n], [2n], [3n], [4n]];
const visited = new Map<string, bigint>();
visited.set("0x0y", 1n);

let result: number;
while (queue.length) {
  const path = queue.shift();
  const coords = getCoords(path);
  // console.log({path});
  // console.log(coords);
  // console.log(visited);

  if (visited.has(coords)) continue;

  // if (l !== path.length) {
  //   l = path.length;
  //   console.log(l);
  // }
  // console.log({path});

  const { output } = i.run(path);
  // console.log({output});
  const [droidStatus] = output.slice(-1);

  if (droidStatus === 0n) {
    visited.set(coords, 0n);
    path.pop();
  }
  if (droidStatus === 1n) {
    visited.set(coords, 1n);
    ALL_DIRECTIONS.forEach(direction => {
      queue.push([...path, direction]);
    });
  }
  if (droidStatus === 2n) {
    visited.set(coords, 2n);
  }

  const pathBack = path.map(getOppositeDirection);
  pathBack.reverse();
  // console.log({pathBack});
  i.run(pathBack);
  // console.log({back});
  // console.log()
}

// const printVisited = (visitMap: Map<string, bigint>, oxyMap: Set<string>) => {
//   let xMax = -Infinity;
//   let yMax = -Infinity;
//   let xMin = Infinity;
//   let yMin = Infinity;

//   [...visitMap.keys()].forEach(key => {
//     const [x, y] = key
//       .match(expr)
//       .slice(1)
//       .map(Number);

//     if (x < xMin) xMin = x;
//     if (y < yMin) yMin = y;
//     if (x > xMax) xMax = x;
//     if (y > yMax) yMax = y;
//   });

//   const width = Math.abs(xMin - xMax) + 1;
//   const height = Math.abs(yMin - yMax) + 1;

//   const map = new Array(height).fill(0).map(_ => new Array(width).fill("#"));
//   const xStart = Math.abs(xMin);
//   const yStart = Math.abs(yMin);

//   [...visitMap.keys()].forEach(key => {
//     const [x, y] = key
//       .match(expr)
//       .slice(1)
//       .map(Number);
//     // console.log("here");
//     // console.log({ yy: yStart + y, xx: xStart + x });
//     map[yStart + y][xStart + x] = ".";
//     // console.log("here2");
//   });

//   [...oxyMap.keys()].forEach(key => {
//     const [x, y] = key
//       .match(expr)
//       .slice(1)
//       .map(Number);
//     // console.log("here");
//     // console.log({ yy: yStart + y, xx: xStart + x });
//     map[yStart + y][xStart + x] = "O";
//     // console.log("here2");
//   });

//   for (let row of map) console.log(row.join(""));
// };

for (let [key, value] of visited.entries()) {
  if (value === 0n) visited.delete(key);
}

const systemPosition = [...visited.entries()].find(
  ([_key, value]) => value === 2n
)[0];

const visitedByOxygen = new Set<string>();

let visitQueue: string[][] = [[systemPosition]];
let minutes = 0;

const run = async () => {
  while (visitQueue.length) {
    await new Promise(x => setTimeout(x, 100));
    // printVisited(visited, visitedByOxygen);
    console.log("\n");
    const current = visitQueue.shift();

    current.forEach(coord => {
      visitedByOxygen.add(coord);
    });

    let allAdjecent: string[] = [];

    current.forEach(coord => {
      const adjecent = getAdjCoords(coord).filter(
        x => visited.has(x) && !visitedByOxygen.has(x)
      );
      allAdjecent = [...allAdjecent, ...adjecent];
    });
    if (allAdjecent.length === 0) continue;

    visitQueue = [...visitQueue, allAdjecent];
    minutes += 1;
  }
  console.log(minutes);
};

run();
