import { createImageDistortionArea } from './ui/create-image-distortion-area'
import { distort } from './js/distort-image'

export { createImageDistortionArea }

export async function runImageDistortion({ image, canvas, rows, cols, grayscale, alpha }) {
  if (!image) {
    throw Error('Choose an image to run')
  }
  if (!canvas) {
    throw Error('Missing canvas')
  }
  
  await distort({ image, canvas, rows, cols, grayscale, alpha })
}
