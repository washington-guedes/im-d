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
