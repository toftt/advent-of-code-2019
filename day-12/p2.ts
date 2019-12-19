export {};

import { readFileSync } from "fs";

interface XYZ {
  x: number;
  y: number;
  z: number;
}

interface Moon {
  position: XYZ;
  velocity: XYZ;
}

const step = (moons: Moon[]) => {
  for (let i = 0; i < moons.length; i++) {
    const currentMoon = moons[i];
    for (let j = 0; j < moons.length; j++) {
      if (i === j) continue;
      const otherMoon = moons[j];

      ["x", "y", "z"].forEach(key => {
        if (currentMoon.position[key] > otherMoon.position[key])
          currentMoon.velocity[key] -= 1;
        if (currentMoon.position[key] < otherMoon.position[key])
          currentMoon.velocity[key] += 1;
      });
    }
  }
  for (let i = 0; i < moons.length; i++) {
    const currentMoon = moons[i];
    ["x", "y", "z"].forEach(key => {
      currentMoon.position[key] += currentMoon.velocity[key];
    });
  }
};

const calculateTotalEnergy = (moons: Moon[]) => {
  return moons.reduce((acc, moon) => {
    let kin = 0;
    let pot = 0;
    ["x", "y", "z"].forEach(key => {
      pot += Math.abs(moon.position[key]);
      kin += Math.abs(moon.velocity[key]);
    });

    return acc + kin * pot;
  }, 0);
};

const run = () => {
  const parseMoonRegExpr = /x=(-?\d+).*y=(-?\d+).*z=(-?\d+)/;

  const input = readFileSync("day-12/input", "utf8");
  const lines = input.trim().split("\n");

  const moons: Moon[] = lines.map(line => {
    const [x, y, z] = line
      .trim()
      .match(parseMoonRegExpr)
      .slice(1)
      .map(Number);

    return { position: { x, y, z }, velocity: { x: 0, y: 0, z: 0 } };
  });

  const start = process.hrtime();
  for (let i = 1; i <= 100000; i++) {
    step(moons);
    if (i % 1000 === 0) {
      console.log(`step: ${i}`);
      for (let moon of moons)
        console.log({ position: moon.position, velocity: moon.velocity });
    }
  }
  const end = process.hrtime(start);
  console.info("Execution time (hr): %ds %dms", end[0], end[1] / 1000000);

  const result = calculateTotalEnergy(moons);
  console.log(result);
};

run();
