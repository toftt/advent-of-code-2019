export class IntCode {
  private memory: Map<bigint, bigint> = new Map();
  private pointer: bigint = 0n;
  private relativeBase: bigint = 0n;
  private inputBuffer: bigint[];
  private outputBuffer: bigint[] = [];

  constructor(initialMemory: string[], inputBuffer: bigint[] = []) {
    this.inputBuffer = [...inputBuffer];

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
