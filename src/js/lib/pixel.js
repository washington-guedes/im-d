export class Pixel {
  constructor() {
    this.r = 0;
    this.g = 0;
    this.b = 0;
    this.a = 0;
    this.len = 0;
  }

  add(r, g, b, a) {
    this.r += r;
    this.g += g;
    this.b += b;
    this.a += a;
    this.len += 1;
  }

  avg(s = 'rgba') {
    let sum = 0;
    const slen = s.length;
    for (let i = 0; i < slen; i += 1) {
      sum += this[s[i]];
    }
    return Math.floor(sum / (slen * this.len));
  }
}

export default Pixel;
