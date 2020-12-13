import { create } from './ui/default/create';
import { distortImage } from './js/lib/distort-image';
import { loadImage as _loadImage } from './js/lib/load-image';

/**
* Use this method if you have built a **custom UI**
* with all needed **input values** to run the image distortion
* - The result will be set on the { canvas } element
*/
export function runDistortion({
  input,
  canvas,
  stream = false,
  rows = 8,
  cols = 8,
  avgR = false,
  avgG = false,
  avgB = false,
  avgA = false,
  log = false,
} = {}) {
  if (!input) {
    throw Error('Missing photo input');
  }
  if (!canvas) {
    throw Error('Missing canvas');
  }
  distortImage({
    canvas, input, stream, rows, cols, avgR, avgG, avgB, avgA, log,
  });
}

/**
* Receives the **HTML element** to use as **wrapper**
* to include the default UI inside
*/
export function createDefaultUI({
  wrapper,
  image,
  stream = false,
  rows = 8,
  cols = 8,
  avgR = false,
  avgG = false,
  avgB = false,
  avgA = false,
  log = false,
} = {}) {
  if (!wrapper) {
    throw Error('Missing wrapper element to build the default UI on it');
  }
  create({
    wrapper, image, stream, rows, cols, avgR, avgG, avgB, avgA, log,
  });
}

/**
* A utility function to help you ;)
*/
export async function loadImageFromInputFile({
  inputFile,
  log = false,
} = {}) {
  if (!inputFile) {
    throw Error('Missing input file to load image');
  }
  return _loadImage.call(inputFile, { log });
}
