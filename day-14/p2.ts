export {};

import { readFileSync } from "fs";

interface Item {
  amount: number;
  chemical: string;
}
interface Reaction {
  input: Item[];
  output: Item;
}

const parseInput = () => {
  const regExpr = /(\d+) (\w+)/g;
  const input = readFileSync("day-14/input", "utf8");
  const lines = input.trim().split("\n");

  const parseItem = (match: RegExpMatchArray): Item => {
    const amount = Number(match[1]);
    const chemical = match[2];

    return { amount, chemical };
  };

  return lines.map(
    (line): Reaction => {
      const matches = [...line.matchAll(regExpr)];
      const output = parseItem(matches.pop());
      const input = matches.map(parseItem);

      return { input, output };
    }
  );
};

const reactions = parseInput();
const m = new Map<string, Reaction>();
const chemicalStorage = new Map<string, number>();

reactions.forEach(reaction => {
  const { output } = reaction;
  m.set(output.chemical, reaction);
});

let fuelProduced = 0;
let oreNeeded = 0;
let breakIt = false;

while (true) {
  const needed = [...m.get("FUEL").input];

  while (needed.length) {
    if (oreNeeded > 1000000000000) {
      breakIt = true;
      break;
    }
    const { amount: amountNeeded, chemical } = needed[0];
    // console.log(`Need to produce ${amountNeeded} of ${chemical}`);
    if (chemical === "ORE") {
      // console.log(`Chemical was ORE, adding ${amountNeeded} to ${oreNeeded}`);
      oreNeeded += amountNeeded;
      needed.shift();
      continue;
    }

    const leftOverAmount = chemicalStorage.get(chemical) || 0;
    if (leftOverAmount >= amountNeeded) {
      // console.log('using leftovers');
      chemicalStorage.set(chemical, leftOverAmount - amountNeeded);
      needed.shift();
      continue;
    }

    const reaction = m.get(chemical);
    const amountProduced = reaction.output.amount;
    // console.log(`Recipe to produce ${amountProduced} of ${chemical} is:`);
    // console.log("#############################");
    // console.log(reaction.input);
    // console.log("#############################");
    const multiplier = Math.ceil(
      (amountNeeded - leftOverAmount) / amountProduced
    );
    // console.log(`Multiplier is ${multiplier}`);

    reaction.input.forEach(({ chemical, amount: unmodifiedAmount }) => {
      // console.log(`Adding ${unmodifiedAmount * multiplier} ${chemical} to queue`);
      needed.push({ chemical, amount: unmodifiedAmount * multiplier });
    });
    chemicalStorage.set(chemical, leftOverAmount + amountProduced * multiplier);
    // console.log();
  }
  if (breakIt) break;
  fuelProduced += 1;
}

// takes like 10 minutes to run...
console.log(fuelProduced);
