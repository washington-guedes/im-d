import { make } from '../utils/make'
import { Pixel } from './pixel'

let running = false

export function run({ canvas, image, rows, cols, grayscale, alpha, log }) {
  if (running) {
    throw Error('Already running')
  }
  if (rows < 1 || cols < 1) {
    throw Error('Invalid block size')
  }
  
  const actionLabel = (() => {
    let label = `${rows} rows, ${cols} cols`
    if (grayscale) label += ', grayscale'
    if (alpha) label += ', alpha included'
    return label
  })()
  
  running = true
  if (log) console.time(actionLabel)
  
  canvas.width = image.width
  canvas.height = image.height
  
  const ctx = canvas.getContext('2d')
  ctx.drawImage(image, 0, 0)
  
  const { width, height } = canvas
  const imageData = ctx.getImageData(0, 0, width, height)
  const { data: pixels } = imageData
  
  const arr = make(rows, _ => make(cols, _ => new Pixel()))
  const rowHeight = Math.ceil(height / rows)
  const colWidth = Math.ceil(width / cols)
  
  const loop = fn => {
    let row = 0, rowlimit = rowHeight
    for (let i = 0; i < height; i++) {
      const past = i * width * 4
      if (i === rowlimit) {
        row++
        rowlimit += rowHeight
      }
      let col = 0, collimit = colWidth
      for (let j = 0, px = 0; j < width; j++, px += 4) {
        if (j >= collimit) {
          col++
          collimit += colWidth
        }
        fn(past + px, arr[row][col])
      }
    }
  }
  
  loop((k, item) => {
    item.add(pixels[k], pixels[k+1], pixels[k+2], pixels[k+3])
  })
  
  loop((k, item) => {
    if (grayscale) {
      if (alpha) {
        pixels[k] = pixels[k+1] = pixels[k+2] = pixels[k+3] = item.avg('rgba')
      } else {
        pixels[k] = pixels[k+1] = pixels[k+2] = item.avg('rgb')
        pixels[k+3] = item.avg('a')
      }
    } else {
      if (alpha) {
        pixels[k] = item.avg('ra')
        pixels[k+1] = item.avg('ga')
        pixels[k+2] = item.avg('ba')
        pixels[k+3] = item.avg('a')
      } else {
        pixels[k] = item.avg('r')
        pixels[k+1] = item.avg('g')
        pixels[k+2] = item.avg('b')
        pixels[k+3] = item.avg('a')
      }
    }
  })
  
  ctx.putImageData(imageData, 0, 0)
  
  if (log) console.timeEnd(actionLabel)
  running = false
}
