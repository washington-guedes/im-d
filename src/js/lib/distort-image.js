import { make } from '../utils/make'
import { Pixel } from './pixel'

let running = false

export function run({ canvas, image, rows, cols, avgR, avgG, avgB, avgA, log }) {
  if (running) {
    throw Error('Already running')
  }
  if (rows < 1 || cols < 1) {
    throw Error('Invalid block size')
  }
  
  rows = Math.min(rows, Math.max(canvas.height, image.height))
  cols = Math.min(cols, Math.max(canvas.width, image.width))
  
  const actionLabel = (() => {
    let label = `${rows} rows, ${cols} cols`
    if (avgR) label += ', avgR'
    if (avgG) label += ', avgG'
    if (avgB) label += ', avgB'
    if (avgA) label += ', avgA'
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
  
  let groupedKey = ''
  if (avgR) groupedKey += 'r'
  if (avgG) groupedKey += 'g'
  if (avgB) groupedKey += 'b'
  if (avgA) groupedKey += 'a'
  
  loop((k, item) => {
    const groupedAvg = item.avg(groupedKey)
    pixels[k] = avgR ? groupedAvg : item.avg('r')
    pixels[k+1] = avgG ? groupedAvg : item.avg('g')
    pixels[k+2] = avgB ? groupedAvg : item.avg('b')
    pixels[k+3] = avgA ? groupedAvg : item.avg('a')
  })
  
  ctx.putImageData(imageData, 0, 0)
  
  if (log) console.timeEnd(actionLabel)
  running = false
}
