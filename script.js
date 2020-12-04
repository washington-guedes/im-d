
photo.onchange = loadImage
nrows.onchange = distort
ncols.onchange = distort
grayscale.onchange = distort
alpha.onchange = distort

let uploading = false
let running = false
let image = null

function loadImage() {
  if (!photo.files || !photo.files[0]) {
    return console.warn('Missing photo')
  }
  if (uploading) {
    return
  }
  uploading = true
  console.time('loading image')
  
  const img = new Image()
  img.onload = function () {
    output.width = this.width
    output.height = this.height
    image = img
    console.timeEnd('loading image')
    uploading = false
    distort()
  }
  
  const _in = new FileReader()
  _in.onload = () => img.src = _in.result
  _in.readAsDataURL(photo.files[0])
}

function distort() {
  if (!image) {
    return console.warn('Missing image')
  }
  if (+nrows.value < 1 || +ncols.value < 1) {
    return console.warn('Invalid block size')
  }
  if (running) {
    return
  }
  running = true
  console.time('distortion')
  console.log(nrows.value, ncols.value, grayscale.checked, alpha.checked)

  const ctx = output.getContext('2d')
  ctx.drawImage(image, 0, 0)

  const canvasImage = ctx.getImageData(0, 0, output.width, output.height)
  const pixels = canvasImage.data

  const m = output.height
  const n = output.width * 4

  const arr = make(nrows.value, _ => make(ncols.value, _ => new Pixel()))

  const loop = fn => {
    for (let i = 0; i < m; i++) {
      const row = (i / (m / nrows.value)) | 0

      for (let j = 0; j < n; j += 4) {
        const k = i * n + j
        const col = (j / (n / ncols.value)) | 0

        fn(k, arr[row][col])
      }
    }
  }

  loop((k, item) => {
    item.add(pixels[k], pixels[k+1], pixels[k+2], pixels[k+3])
  })

  loop((k, item) => {
    if (grayscale.checked) {
      if (alpha.checked) {
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
  })

  ctx.putImageData(canvasImage, 0, 0)

  console.timeEnd('distortion')
  running = false
}

function make(len, mapper) {
  return [...new Array(+len)].map(mapper)
}

class Pixel {
  r = 0
  g = 0
  b = 0
  a = 0
  len = 0

  add(r, g, b, a) {
    this.r += r
    this.g += g
    this.b += b
    this.a += a
    this.len++
  }

  avg_r() {
    return this.r / this.len | 0
  }
  avg_g() {
    return this.g / this.len | 0
  }
  avg_b() {
    return this.b / this.len | 0
  }
  avg_a() {
    return this.a / this.len | 0
  }
  avg_rgb() {
    return (this.r + this.g + this.b) / 3 / this.len | 0
  }
  avg_rgba() {
    return (this.r + this.g + this.b + this.a) / 4 / this.len | 0
  }
}
