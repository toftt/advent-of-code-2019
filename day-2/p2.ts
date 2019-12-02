const fs = require("fs");

const runProgram = (program: number[]) => {
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

  return program[0];
};

const input = fs.readFileSync("day-2/input", "utf8");
const programInput = input.split(",").map(Number);

for (let i = 0; i < 100; i++)
  for (let j = 0; j < 100; j++) {
    const inputClone = [...programInput];
    inputClone[1] = i; 
    inputClone[2] = j; 

    const result = runProgram(inputClone);
    if (result === 19690720) {
      console.log(100 * i + j);
    }
  }
