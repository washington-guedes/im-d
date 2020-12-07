import { create as _createDefaultUI } from './ui/default/create'
import { run as _runImageDistortion } from './js/lib/distort-image'
import { loadImage as _loadImage } from './js/lib/load-image'

/**
* Use this method if you have built a **custom UI**
* with all needed **input values** to run the image distortion
* - The result will be set on the { canvas } element
*/
export function runDistortion({ image, canvas, rows, cols, grayscale, alpha, log } = {}) {
  if (!image) {
    throw Error('Missing photo image')
  }
  if (!canvas) {
    throw Error('Missing canvas')
  }
  
  _runImageDistortion({
    image,
    canvas,
    rows,
    cols,
    grayscale,
    alpha,
    log
  })
}

/**
* Receives the **HTML element** to use as **wrapper**
* to include the default UI inside
*/
export function createDefaultUI({ wrapper, log } = {}) {
  if (!wrapper) {
    throw Error('Missing wrapper element to build the default UI on it')
  }
  _createDefaultUI({ wrapper, log })
}

/**
* A utility function to help you ;)
*/
export async function loadImageFromInputFile({ inputFile, log } = {}) {
  if (!inputFile) {
    throw Error('Missing input file to load image')
  }
  return _loadImage.call(inputFile, { log })
}
