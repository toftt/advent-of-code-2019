export {}

const fs = require("fs");

const input = fs.readFileSync("day-6/input", "utf8");
const lines = input.split("\n").filter(Boolean);

const orbitInput = lines.map((line: string) => line.split(")"));

const orbits = new Map<string, Set<string>>();

orbitInput.forEach(([target, orbiter]) => {
  if (!orbits.has(target)) orbits.set(target, new Set());
  if (!orbits.has(orbiter)) orbits.set(orbiter, new Set());

  orbits.get(target).add(orbiter);
  orbits.get(orbiter).add(target);
});

const findPath = (
  from: string,
  to: string,
  visited: Set<string> = new Set()
) => {
  if (from === to) return visited.size;

  const edges = [...orbits.get(from)].filter(x => !visited.has(x));
  if (!edges.length) return Infinity;

  return Math.min(
    ...edges.map((edge: string) => findPath(edge, to, new Set(visited).add(from)))
  );
};

const result = findPath('SAN', 'YOU') - 2;

console.log(result);
