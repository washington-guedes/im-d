import { create as _createDefaultUI } from './ui/default/create'
import { run as _runImageDistortion } from './js/lib/distort-image'
import { loadImage as _loadImage } from './js/lib/load-image'

/**
* Use this method if you have built a **custom UI**
* with all needed **input values** to run the image distortion
* - The result will be set on the { canvas } element
*/
export function runDistortion({
  image,
  canvas,
  rows = 8,
  cols = 8,
  avgR = false,
  avgG = false,
  avgB = false,
  avgA = false,
  log = false
} = {}) {
  if (!image) {
    throw Error('Missing photo image')
  }
  if (!canvas) {
    throw Error('Missing canvas')
  }
  _runImageDistortion({ image, canvas, rows, cols, avgR, avgG, avgB, avgA, log })
}

/**
* Receives the **HTML element** to use as **wrapper**
* to include the default UI inside
*/
export function createDefaultUI({
  wrapper,
  image = new Image(),
  rows = 8,
  cols = 8,
  avgR = false,
  avgG = false,
  avgB = false,
  avgA = false,
  log = false
} = {}) {
  if (!wrapper) {
    throw Error('Missing wrapper element to build the default UI on it')
  }
  _createDefaultUI({ wrapper, image, rows, cols, avgR, avgG, avgB, avgA, log })
}

/**
* A utility function to help you ;)
*/
export async function loadImageFromInputFile({
  inputFile,
  log = false
} = {}) {
  if (!inputFile) {
    throw Error('Missing input file to load image')
  }
  return _loadImage.call(inputFile, { log })
}
