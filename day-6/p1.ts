const fs = require("fs");

const input = fs.readFileSync("day-6/input", "utf8");
const lines = input.split("\n").filter(Boolean);

const orbitInput = lines.map((line: string) => line.split(")"));

const orbits = new Map<string, string[]>();

orbitInput.forEach(([target, orbiter]) => {
  if (!orbits.has(target)) orbits.set(target, []);

  orbits.get(target).push(orbiter);
});


const getOrbiterCount = (name: string, depth: number = 0) => {
  if (!orbits.has(name)) {
    return depth;
  }

  const directOrbiters = orbits.get(name);

  let indirectOrbiterCount = 0;

  directOrbiters.forEach(name => {
    indirectOrbiterCount += getOrbiterCount(name, depth + 1);
  });

  return indirectOrbiterCount + depth;
};

const result = getOrbiterCount("COM");
console.log(result);
