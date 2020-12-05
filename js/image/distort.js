let running = false

async function distort({ canvas, image, rows, cols, grayscale, alpha }) {
  if (running) {
    throw Error('Already running')
  }
  if (rows < 1 || cols < 1) {
    throw Error('Invalid block size')
  }
  
  running = true
  console.time('distortion')
  console.log(rows, cols, grayscale, alpha)
  
  canvas.width = image.width
  canvas.height = image.height
  
  const ctx = canvas.getContext('2d')
  ctx.drawImage(image, 0, 0)
  
  const { width, height } = canvas
  const imageData = ctx.getImageData(0, 0, width, height)
  const { data: pixels } = imageData
  
  const arr = make(rows, _ => make(cols, _ => new Pixel()))
  
  loop({
    width, height, cols, rows, arr, fn: (k, item) => {
      item.add(pixels[k], pixels[k+1], pixels[k+2], pixels[k+3])
    }
  })
  
  loop({
    width, height, cols, rows, arr, fn: (k, item) => {
      if (grayscale) {
        if (alpha) {
          pixels[k] = pixels[k+1] = pixels[k+2] = pixels[k+3] = item.avg_rgba()
        } else {
          pixels[k] = pixels[k+1] = pixels[k+2] = item.avg_rgb()
          pixels[k+3] = item.avg_a()
        }
      } else {
        pixels[k] = item.avg_r()
        pixels[k+1] = item.avg_g()
        pixels[k+2] = item.avg_b()
        pixels[k+3] = item.avg_a()
      }
    }
  })
  
  ctx.putImageData(imageData, 0, 0)
  
  console.timeEnd('distortion')
  running = false
}

function loop({ fn, width, height, arr, rows, cols }) {
  const colWidth = Math.ceil(width / cols)
  const rowHeight = Math.ceil(height / rows)
  
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
