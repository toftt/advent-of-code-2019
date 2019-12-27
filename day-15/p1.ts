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

const program = readFileSync("day-15/input", "utf8")
  .trim()
  .split(",");
const i = new IntCode(program);

const queue: Direction[][] = [[1n], [2n], [3n], [4n]];
const visited = new Set<string>();
visited.add("0x0y");

let result: number;
let l = 0;
while (queue.length) {
  const path = queue.shift();
  const coords = getCoords(path);
  // console.log({path});
  // console.log(coords);
  // console.log(visited);

  if (visited.has(coords)) continue;
  else visited.add(coords);

  // if (l !== path.length) {
  //   l = path.length;
  //   console.log(l);
  // }
  // console.log({path});

  const { output } = i.run(path);
  // console.log({output});
  const [droidStatus] = output.slice(-1);

  if (droidStatus === 0n) {
    path.pop();
  }
  if (droidStatus === 1n) {
    ALL_DIRECTIONS.forEach(direction => {
      queue.push([...path, direction]);
    });
  }
  if (droidStatus === 2n) {
    result = path.length;
    break;
  }

  const pathBack = path.map(getOppositeDirection);
  pathBack.reverse();
  // console.log({pathBack});
  i.run(pathBack);
  // console.log({back});
  // console.log()
}

console.log(result);
