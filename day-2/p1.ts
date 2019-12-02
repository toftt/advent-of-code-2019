const fs = require("fs");

const input = fs.readFileSync("day-2/input", "utf8");
const program = input.split(",").map(Number);

program[1] = 12;
program[2] = 2;

let pointer = 0;
let shouldExit = false;

while (true) {
  const opCode = program[pointer];

  switch (opCode) {
    case 1:
    case 2: {
      const i1 = program[program[pointer + 1]];
      const i2 = program[program[pointer + 2]];
      const output = program[pointer + 3];

      const result = opCode === 1 ? i1 + i2 : i1 * i2;
      program[output] = result;
      pointer += 4;
      break;
    }
    case 99:
    default: {
      shouldExit = true;
      break;
    }
  }

  if (shouldExit) break;
}

console.log(program[0]);
