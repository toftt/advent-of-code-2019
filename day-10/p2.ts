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

const getAngle = (p1: Point, p2: Point) => {
  const v1 = { x: 0, y: -1 };
  const v2 = { x: p2.x - p1.x, y: p2.y - p1.y };

  const angle = Math.atan2(v2.y, v2.x) - Math.atan2(v1.y, v1.x);
  if (angle >= 0) return angle;
  return 2 * Math.PI + angle;
};

const getDistance = (p1: Point, p2: Point) => {
  const a = Math.pow(p2.x - p1.x, 2);
  const b = Math.pow(p2.y - p1.y, 2);

  return Math.sqrt(a + b);
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
  .map(({ x, y }) => ({ x, y }));

const counts = grid.map(p => ({
  point: p,
  observables: getObservableCount(grid, p)
}));
const max = Math.max(...counts.map(({ observables }) => observables));
const stationLocation = counts.find(c => c.observables === max).point;

const pointsWithoutStation = grid.filter(
  p => !(p.x === stationLocation.x && p.y === stationLocation.y)
);

const angles = pointsWithoutStation.map(p => ({
  point: p,
  angle: getAngle(stationLocation, p),
  distance: getDistance(stationLocation, p)
}));
angles.sort((a, b) => a.angle - b.angle);

const grouped: Map<
  number,
  { point: Point; angle: number; distance: number }[]
> = angles.reduce((acc, x) => {
  if (!acc.has(x.angle)) acc.set(x.angle, []);
  acc.get(x.angle).push(x);
  acc.get(x.angle).sort((a, b) => a.distance - b.distance);
  return acc;
}, new Map());

let i = 0;
let removedPoint200;
while (i < 200) {
  grouped.forEach((value, key, m) => {
    const removed = value.shift();
    if (i === 199) {
      removedPoint200 = removed;
      i += 1;
      return;
    }

    if (value.length === 0) m.delete(key);
    i++;
  });
}

const {x: rX, y: rY} = removedPoint200.point;
const result = rX * 100 + rY;
console.log(result);
