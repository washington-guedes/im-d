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

  avgR() {
    return this.r / this.len | 0
  }
  avgG() {
    return this.g / this.len | 0
  }
  avgB() {
    return this.b / this.len | 0
  }
  avgA() {
    return this.a / this.len | 0
  }
  avgRGB() {
    return (this.r + this.g + this.b) / 3 / this.len | 0
  }
  avgRGBA() {
    return (this.r + this.g + this.b + this.a) / 4 / this.len | 0
  }
}
