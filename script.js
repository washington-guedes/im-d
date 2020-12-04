
load.onclick = read
nrows.onchange = read
ncols.onchange = read
grayscale.onchange = read

function read() {
  const _in = new FileReader()
  const img = new Image()
  img.onload = function () {
    output.width = this.width
    output.height = this.height
    console.log(this.width, this.height)

    const ctx = output.getContext('2d')
    ctx.drawImage(img, 0, 0)
    const image = ctx.getImageData(0, 0, this.width, this.height)
    mutate(image.data)
    ctx.putImageData(image, 0, 0)
  }
  _in.onload = () => img.src = _in.result
  _in.readAsDataURL(photo.files[0])
}

function mutate(pixels) {
  const m = output.height
  const n = output.width * 4

  const arr = make(nrows.value, _ => make(ncols.value, pixel))

  for (let i = 0; i < m; i++) {
    const row = (i / (m / nrows.value)) | 0

    for (let j = 0; j < n; j += 4) {
      const k = i * n + j
      const col = (j / (n / ncols.value)) | 0

      arr[row][col].add(...pixels.slice(k, k + 4))
    }
  }

  console.log(arr.map(x => x.map(y => y.grayscale())))

  for (let i = 0; i < m; i++) {
    const row = (i / (m / nrows.value)) | 0

    for (let j = 0; j < n; j += 4) {
      const k = i * n + j
      const col = (j / (n / ncols.value)) | 0

      const x = arr[row][col];
      const [r, g, b, a] = x.grayscale()
      pixels[k] = r
      pixels[k+1] = g
      pixels[k+2] = b
      pixels[k+3] = a
    }
  }

  console.log('done')
}

function make(len, mapper) {
  return [...new Array(+len)].map(mapper)
}

function pixel() {
  let [_r, _g, _b, _a, _len] = [0, 0, 0, 0, 0]
  const _obj = {}
  const cache = (fn, $ = '') => {
    const key = _len + $
    return _obj[key] = _obj[key] || fn()
  }
  return {
    add(r, g, b, a) {
      _r += r
      _g += g
      _b += b
      _a += a
      _len++
    },
    average() {
      return cache(_ => [_r, _g, _b, _a].map(x => (x / _len) | 0), 'avg')
    },
    grayscale() {
      return make(4, _ => cache(_ => (sum(this.average()) / 4) | 0, 'b&w'))
    }
  }
}

function sum(arr) {
  return arr.reduce((acc, x) => acc + x, 0)
}
