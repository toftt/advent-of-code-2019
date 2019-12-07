export {};

const fs = require("fs");

type Opcode = "01" | "02" | "03" | "04" | "05" | "06" | "07" | "08" | "99";

interface ProgramState {
  memory: string[];
  pointer: number;
  inputBuffer: number[];
}

const runProgram = (state: ProgramState) => {
  const outputBuffer = [];

  const readParam = (input: string, mode?: string): number => {
    if (mode === "0") return Number(state.memory[Number(input)]);
    return Number(input);
  };

  let shouldExit: boolean = false;
  while (true) {
    const instruction = state.memory[state.pointer].toString().padStart(5, "0");
    const opcode = instruction.slice(3, 5) as Opcode;
    const [m3, m2, m1] = instruction.split("");

    switch (opcode) {
      case "01":
        const i1 = readParam(state.memory[state.pointer + 1], m1);
        const i2 = readParam(state.memory[state.pointer + 2], m2);
        const writePos = readParam(state.memory[state.pointer + 3]);

        const result = i1 + i2;
        state.memory[writePos] = String(result);
        state.pointer += 4;
        break;
      case "02": {
        const i1 = readParam(state.memory[state.pointer + 1], m1);
        const i2 = readParam(state.memory[state.pointer + 2], m2);
        const writePos = readParam(state.memory[state.pointer + 3]);

        const result = i1 * i2;
        state.memory[writePos] = String(result);
        state.pointer += 4;
        break;
      }
      case "03": {
        if (state.inputBuffer.length === 0) {
          shouldExit = true;
          break;
        }

        const input = state.inputBuffer.shift();
        const writePos = readParam(state.memory[state.pointer + 1]);

        state.memory[writePos] = String(input);
        state.pointer += 2;
        break;
      }
      case "04": {
        const output = readParam(state.memory[state.pointer + 1], m1);

        outputBuffer.push(output);
        state.pointer += 2;
        break;
      }
      // jump-if-true
      case "05": {
        const i1 = readParam(state.memory[state.pointer + 1], m1);
        const i2 = readParam(state.memory[state.pointer + 2], m2);

        if (i1 !== 0) state.pointer = i2;
        else state.pointer += 3;

        break;
      }
      // jump-if-false
      case "06": {
        const i1 = readParam(state.memory[state.pointer + 1], m1);
        const i2 = readParam(state.memory[state.pointer + 2], m2);

        if (i1 === 0) state.pointer = i2;
        else state.pointer += 3;

        break;
      }
      // less-than
      case "07": {
        const i1 = readParam(state.memory[state.pointer + 1], m1);
        const i2 = readParam(state.memory[state.pointer + 2], m2);
        const writePos = readParam(state.memory[state.pointer + 3]);

        if (i1 < i2) state.memory[writePos] = "1";
        else state.memory[writePos] = "0";

        state.pointer += 4;
        break;
      }
      // equals
      case "08": {
        const i1 = readParam(state.memory[state.pointer + 1], m1);
        const i2 = readParam(state.memory[state.pointer + 2], m2);
        const writePos = readParam(state.memory[state.pointer + 3]);

        if (i1 === i2) state.memory[writePos] = "1";
        else state.memory[writePos] = "0";

        state.pointer += 4;
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
  return outputBuffer;
};

const trySequence = (sequence: number[]) => {
  const rawProgram = fs.readFileSync("day-7/input", "utf8");
  const program = rawProgram.split(",");

  const t1: ProgramState = {
    memory: [...program],
    pointer: 0,
    inputBuffer: [sequence[0], 0]
  };
  const t2: ProgramState = {
    memory: [...program],
    pointer: 0,
    inputBuffer: [sequence[1]]
  };
  const t3: ProgramState = {
    memory: [...program],
    pointer: 0,
    inputBuffer: [sequence[2]]
  };
  const t4: ProgramState = {
    memory: [...program],
    pointer: 0,
    inputBuffer: [sequence[3]]
  };
  const t5: ProgramState = {
    memory: [...program],
    pointer: 0,
    inputBuffer: [sequence[4]]
  };

  let lastT5Output: number[];
  let tick = 0;
  while (true) {
    const t1Output = runProgram(t1);
    t2.inputBuffer.push(...t1Output);

    const t2Output = runProgram(t2);
    t3.inputBuffer.push(...t2Output);

    const t3Output = runProgram(t3);
    t4.inputBuffer.push(...t3Output);

    const t4Output = runProgram(t4);
    t5.inputBuffer.push(...t4Output);

    const t5Output = runProgram(t5);
    if (t5Output.length) lastT5Output = [...t5Output];
    t1.inputBuffer.push(...t5Output);

    if (
      [t1Output, t2Output, t3Output, t4Output, t5Output].every(
        x => x.length === 0
      )
    ) {
      tick++;
      if (tick > 3) break;
    }
  }

  return lastT5Output[0];
};

let max = -Infinity;
for (let i = 5; i < 10; i++) {
  for (let j = 5; j < 10; j++) {
    for (let k = 5; k < 10; k++) {
      for (let l = 5; l < 10; l++) {
        for (let m = 5; m < 10; m++) {
          const s = new Set([i, j, k, l, m]);
          if (s.size !== 5) continue;

          const result = trySequence([i, j, k, l, m]);

          max = Math.max(result, max);
        }
      }
    }
  }
}

console.log(max);
