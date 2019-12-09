export {};

import { readFileSync } from "fs";

const W = 25;
const H = 6;
const PIXELS_PER_LAYER = W * H;

const getPixelColor = (layeredPixels: number[]) => layeredPixels.find(x => x !== 2);

const input = readFileSync("day-8/input", "utf8");
const pixels = input
  .trim()
  .split("")
  .map(Number);

const image = new Array(PIXELS_PER_LAYER).fill(0).map(() => []);

for (let i = 0; i < pixels.length; i += PIXELS_PER_LAYER) {
  const layer = pixels.slice(i, i + PIXELS_PER_LAYER);
  for (let j = 0; j < layer.length; j++) {
    image[j].push(layer[j]);
  }
}


const visiblePixels = image.map(getPixelColor);

for (let i = 0; i < H; i++) {
  let row = '';
  for (let j = 0; j < W; j++) {
    const pos = i * W + j;
    row += !!visiblePixels[pos] ? '##' : '..';
  }
  console.log(row)
}

