const fs = require("fs");

const hasDouble = (num: number) => {
  const matches = num.toString().match(/(\d)\1+/g);
  if (matches === null) return false;

  return matches.some(x => x.length === 2);
};

const isNeverDecreasing = (num: number) => {
  const digits = num
    .toString()
    .split("")
    .map(Number);

  return digits.slice(1).reduce((acc, x, i) => {
    return acc && x >= digits[i];
  }, true);
};

const isValid = (password: number) =>
  isNeverDecreasing(password) && hasDouble(password);

const input = fs.readFileSync("day-4/input", "utf8");
const [min, max] = input.split("-").map(Number);

let count = 0;
for (let i = min; i < max; i++) {
  if (isValid(i)) count++;
}

console.log(count);
