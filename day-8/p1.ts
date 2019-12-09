export {};

import { readFileSync } from "fs";

const W = 25;
const H = 6;
const PIXELS_PER_LAYER = W * H;

const input = readFileSync("day-8/input", "utf8");
const pixels = input
  .trim()
  .split("")
  .map(Number);

const layers = new Map<number, number>();

for (let i = 0; i < pixels.length; i += PIXELS_PER_LAYER) {
  const layer = pixels.slice(i, i + PIXELS_PER_LAYER);

  const zeroes = layer.filter(x => x === 0).length;
  const ones = layer.filter(x => x === 1).length;
  const twos = layer.filter(x => x === 2).length;

  layers.set(zeroes, ones * twos);
}

const min = Math.min(...layers.keys());
const result = layers.get(min);

console.log(result);
