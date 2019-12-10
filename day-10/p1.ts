export {};

import { readFileSync } from "fs";

type Point = { x: number; y: number };

const intersects = (point1: Point, point2: Point, currPoint: Point) => {
  const dxc = currPoint.x - point1.x;
  const dyc = currPoint.y - point1.y;

  const dxl = point2.x - point1.x;
  const dyl = point2.y - point1.y;

  const cross = dxc * dyl - dyc * dxl;

  if (cross !== 0) return false;
  if (Math.abs(dxl) >= Math.abs(dyl))
    return dxl > 0
      ? point1.x <= currPoint.x && currPoint.x <= point2.x
      : point2.x <= currPoint.x && currPoint.x <= point1.x;
  else
    return dyl > 0
      ? point1.y <= currPoint.y && currPoint.y <= point2.y
      : point2.y <= currPoint.y && currPoint.y <= point1.y;
};

const getObservableCount = (allPoints: Point[], point: Point) => {
  const observables = allPoints.filter(
    ({ x, y }) => !(x === point.x && y === point.y)
  );

  let count = 0;
  observables.forEach(other => {
    const what = observables.filter(
      ({ x, y }) => !(x === other.x && y === other.y)
    );
    const isObservable = what.every(p => {
      const doesIntersect = !intersects(point, other, p);
      // console.log({ point, other, p, doesIntersect });
      return doesIntersect;
    });
    if (isObservable) count++;
  });
  return count;
};

const input = readFileSync("day-10/input", "utf8");
const grid: Point[] = input
  .trim()
  .split("\n")
  .reduce((acc, line, idx) => {
    const filteredCoords = line
      .trim()
      .split("")
      .map((value, pIdx) => ({ y: idx, x: pIdx, value }))
      .filter(x => {
        return x.value === "#";
      });

    return [...acc, ...filteredCoords];
  }, [])
  .map(({ y, x }) => ({ y, x }));

const result = Math.max(...grid.map(p => getObservableCount(grid, p)));
console.log(result);
