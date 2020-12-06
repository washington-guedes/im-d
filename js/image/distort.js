let running = false

async function distort({ canvas, image, rows, cols, grayscale, alpha, border }) {
  if (running) {
    throw Error('Already running')
  }
  if (rows < 1 || cols < 1) {
    throw Error('Invalid block size')
  }
  
  running = true
  console.time('distortion')
  console.log(rows, cols, grayscale, alpha, border)
  
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
        pixels[k] = pixels[k+1] = pixels[k+2] = pixels[k+3] = item.avgRGBA()
      } else {
        pixels[k] = pixels[k+1] = pixels[k+2] = item.avgRGB()
        pixels[k+3] = item.avgA()
      }
    } else {
      pixels[k] = item.avgR()
      pixels[k+1] = item.avgG()
      pixels[k+2] = item.avgB()
      pixels[k+3] = item.avgA()
    }
  })
  
  const avgRGB = k => {
    return (pixels[k] + pixels[k+1] + pixels[k+2]) / 3
  }
  
  const setPixelBlack = k => {
    pixels[k] = pixels[k+1] = pixels[k+2] = 0
    pixels[k+3] = 255
  }
  
  const setBorder = (condition, offset) => {
    if (!condition) {
      return
    }
    loop(k => {
      if (k < offset) return
      const thisAvg = avgRGB(k)
      const prevAvg = avgRGB(k - offset)
      const isAfter = thisAvg > border.eval || prevAvg > border.eval
      const isBefore = thisAvg < border.eval || prevAvg < border.eval
      if ((border.after && isAfter) || (border.before && isBefore)) {
        const diff = Math.abs(avgRGB(k) - avgRGB(k - offset))
        const isLower = border.lt && diff < border.diff
        const isGreater = border.gt && diff > border.diff
        if (isLower || isGreater) {
          setPixelBlack(k - offset)
        }
      }
    })
  }
  
  setBorder(border.v, 4)
  setBorder(border.h, width * 4)
  
  ctx.putImageData(imageData, 0, 0)
  
  console.timeEnd('distortion')
  running = false
}
