const fs = require("fs");

type Opcode = "01" | "02" | "03" | "04" | "99";

const runProgram = (program: string[]) => {
  let pointer: number = 0;
  let shouldExit: boolean = false;

  const readParam = (input: string, mode?: string): number => {
    if (mode === "0") return Number(program[Number(input)]);
    return Number(input);
  };

  while (true) {
    const instruction = program[pointer].toString().padStart(5, "0");
    const opcode = instruction.slice(3, 5);
    const [m3, m2, m1] = instruction.split("");

    switch (opcode) {
      case "01":
        const i1 = readParam(program[pointer + 1], m1);
        const i2 = readParam(program[pointer + 2], m2);
        const writePos = readParam(program[pointer + 3]);

        const result = i1 + i2;
        program[writePos] = String(result);
        pointer += 4;
        break;
      case "02": {
        const i1 = readParam(program[pointer + 1], m1);
        const i2 = readParam(program[pointer + 2], m2);
        const writePos = readParam(program[pointer + 3]);

        const result = i1 * i2;
        program[writePos] = String(result);
        pointer += 4;
        break;
      }
      case "03": {
        const input = 5;
        const writePos = readParam(program[pointer + 1]);

        program[writePos] = String(input);
        pointer += 2;
        break;
      }
      case "04": {
        const output = readParam(program[pointer + 1], m1);

        console.log(output);
        pointer += 2;
        break;
      }
      // jump-if-true
      case "05": {
        const i1 = readParam(program[pointer + 1], m1);
        const i2 = readParam(program[pointer + 2], m2);

        if (i1 !== 0) pointer = i2;
        else pointer += 3;

        break;
      }
      // jump-if-false
      case "06": {
        const i1 = readParam(program[pointer + 1], m1);
        const i2 = readParam(program[pointer + 2], m2);

        if (i1 === 0) pointer = i2;
        else pointer += 3;

        break;
      }
      // less-than
      case "07": {
        const i1 = readParam(program[pointer + 1], m1);
        const i2 = readParam(program[pointer + 2], m2);
        const writePos = readParam(program[pointer + 3]);

        if (i1 < i2) program[writePos] = "1";
        else program[writePos] = "0";

        pointer += 4;
        break;
      }
      // equals
      case "08": {
        const i1 = readParam(program[pointer + 1], m1);
        const i2 = readParam(program[pointer + 2], m2);
        const writePos = readParam(program[pointer + 3]);

        if (i1 === i2) program[writePos] = "1";
        else program[writePos] = "0";

        pointer += 4;
        break;
      }
      case "99":
      default: {
        shouldExit = true;
        break;
      }
    }

    if (shouldExit) break;
  }
};

const input = fs.readFileSync("day-5/input", "utf8");
const programInput = input.split(",");
runProgram(programInput);
