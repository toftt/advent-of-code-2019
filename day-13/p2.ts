export {};
import { readFileSync } from "fs";

class IntCode {
  private memory: Map<bigint, bigint> = new Map();
  private pointer: bigint = 0n;
  private relativeBase: bigint = 0n;
  private inputBuffer: bigint[];
  private outputBuffer: bigint[] = [];

  constructor(initialMemory: string[], inputBuffer: bigint[]) {
    this.inputBuffer = inputBuffer;

    initialMemory.forEach((x, idx) => {
      const pos = BigInt(idx);
      const value = BigInt(x);

      this.memory.set(pos, value);
    });
  }

  run(input: bigint[]) {
    this.outputBuffer = [];
    this.inputBuffer = [...this.inputBuffer, ...input];

    let previous = this.pointer;
    while (true) {
      this.pointer = this.doThing();
      if (previous === this.pointer)
        return { status: "input", output: this.outputBuffer };
      if (this.pointer === -1n)
        return { status: "done", output: this.outputBuffer };
      previous = this.pointer;
    }
  }

  doThing() {
    const instruction = this.memory
      .get(this.pointer)
      .toString()
      .padStart(5, "0");

    const modes = instruction
      .slice(0, -2)
      .split("")
      .reverse()
      .map(Number);

    const opcode = instruction.slice(-2);
    switch (opcode) {
      case "01":
        return this.instrAdd(modes);
      case "02":
        return this.instrMult(modes);
      case "03":
        return this.instrInput(modes);
      case "04":
        return this.instrOutput(modes);
      case "05":
        return this.instrJumpIfTrue(modes);
      case "06":
        return this.instrJumpIfFalse(modes);
      case "07":
        return this.instrLessThan(modes);
      case "08":
        return this.instrEquals(modes);
      case "09":
        return this.instrIncreaseRelativeBase(modes);
      case "99":
        return -1n;
      default:
        throw new Error(`Unregonized opcode ${opcode}`);
    }
  }

  private interact(
    offset: bigint,
    mode: number,
    operation: "write" | "read",
    value: bigint = 0n
  ) {
    let position: bigint;
    switch (mode) {
      case 0: {
        position = this.memory.get(this.pointer + offset);
        break;
      }
      case 1: {
        position = this.pointer + offset;
        break;
      }
      case 2: {
        position = this.memory.get(this.pointer + offset) + this.relativeBase;
        break;
      }
      default: {
        throw new Error(`Unregonized mode ${mode}`);
      }
    }

    if (operation === "read") return this.memory.get(position) || 0n;
    this.memory.set(position, value);
  }

  private instrAdd(modes: number[]) {
    const param1 = this.interact(1n, modes[0], "read");
    const param2 = this.interact(2n, modes[1], "read");

    const result = param1 + param2;

    this.interact(3n, modes[2], "write", result);
    return this.pointer + 4n;
  }

  private instrMult(modes: number[]) {
    const param1 = this.interact(1n, modes[0], "read");
    const param2 = this.interact(2n, modes[1], "read");

    const result = param1 * param2;

    this.interact(3n, modes[2], "write", result);
    return this.pointer + 4n;
  }

  private instrInput(modes: number[]) {
    if (this.inputBuffer.length === 0) {
      return this.pointer;
    }

    const input = this.inputBuffer.shift();
    this.interact(1n, modes[0], "write", input);
    return this.pointer + 2n;
  }
  private instrOutput(modes: number[]) {
    const param1 = this.interact(1n, modes[0], "read");
    this.outputBuffer.push(param1);
    return this.pointer + 2n;
  }
  private instrJumpIfTrue(modes: number[]) {
    const param1 = this.interact(1n, modes[0], "read");
    const param2 = this.interact(2n, modes[1], "read");

    if (param1 !== 0n) return param2;
    return this.pointer + 3n;
  }
  private instrJumpIfFalse(modes: number[]) {
    const param1 = this.interact(1n, modes[0], "read");
    const param2 = this.interact(2n, modes[1], "read");

    if (param1 === 0n) return param2;
    return this.pointer + 3n;
  }
  private instrLessThan(modes: number[]) {
    const param1 = this.interact(1n, modes[0], "read");
    const param2 = this.interact(2n, modes[1], "read");

    if (param1 < param2) this.interact(3n, modes[2], "write", 1n);
    else this.interact(3n, modes[2], "write", 0n);

    return this.pointer + 4n;
  }
  private instrEquals(modes: number[]) {
    const param1 = this.interact(1n, modes[0], "read");
    const param2 = this.interact(2n, modes[1], "read");

    if (param1 === param2) this.interact(3n, modes[2], "write", 1n);
    else this.interact(3n, modes[2], "write", 0n);

    return this.pointer + 4n;
  }

  private instrIncreaseRelativeBase(modes: number[]) {
    const param1 = this.interact(1n, modes[0], "read");
    this.relativeBase += param1;

    return (this.pointer += 2n);
  }

  private instrExit() {
    return this.pointer;
  }
}

const WIDTH = 40;
const HEIGHT = 20;

const tiles = new Map([
  [0, " "],
  [1, "#"],
  [2, "E"],
  [3, "-"],
  [4, "0"]
]);

const gameBoard: string[][] = new Array(HEIGHT)
  .fill(undefined)
  .map(_ => new Array(WIDTH).fill(0));

let globalScoreSomething = 0;
const paint = (output: bigint[]) => {
  const outputCopy = [...output];

  let score = 0;
  while (outputCopy.length) {
    const [x, y, tileId] = outputCopy.splice(0, 3).map(Number);
    if (x === -1 && y === 0) {
      score = tileId;
      globalScoreSomething = tileId;
      continue;
    }

    gameBoard[y][x] = tiles.get(tileId);
  }

  // for (let i = 0; i < HEIGHT; i++) {
  //   for (let j = 0; j < WIDTH; j++) {
  //     process.stdout.cursorTo(j, i);
  //     process.stdout.write(gameBoard[i][j]);
  //   }
  // }

  // process.stdout.cursorTo(WIDTH + 5, 0);
  // process.stdout.write(`Score: ${score}`);
  // process.stdout.cursorTo(80, 80);
};

const getInfo = (output: bigint[]) => {
  const outputCopy = [...output];

  let ball = { x: 0, y: 0 };
  let paddle = { x: 0, y: 0 };
  while (outputCopy.length) {
    const [x, y, tileId] = outputCopy.splice(0, 3).map(Number);
    if (x === -1 && y === 0) {
      continue;
    }
    if (tileId === 3) paddle = { x, y };
    if (tileId === 4) ball = { x, y };
  }

  let input = 1n;
  if (paddle.x === ball.x) input = 0n;
  if (paddle.x > ball.x) input = -1n;

  return input;
};

const run = () => {
  const input = readFileSync("day-13/input", "utf8");
  const program = input.trim().split(",");
  program[0] = "2";

  const i = new IntCode(program, []);

  let { output } = i.run([]);
  paint(output);

  while (true) {
    const input = getInfo(output);
    const outputStatus = i.run([input]);
    const { status } = outputStatus;

    output = outputStatus.output;

    paint(output);
    if (status === "done") break;
  }
  console.log(globalScoreSomething);
};

run();
