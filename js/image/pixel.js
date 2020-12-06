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
  
  avg(s = 'rgba') {
    let sum = 0
    let slen = s.length
    for (let i = 0; i < slen; i++) {
      sum += this[s[i]]
    }
    return sum / (slen * this.len) | 0
  }
}
