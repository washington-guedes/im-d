const output = document.getElementById('output')
let image

const nrows = document.getElementById('nrows')
const ncols = document.getElementById('ncols')
const grayscale = document.getElementById('grayscale')
const alpha = document.getElementById('alpha')
const border = {
  h: document.getElementById('borderh'),
  v: document.getElementById('borderv'),
  diff: document.getElementById('borderdiff'),
  lt: document.getElementById('borderlt'),
  gt: document.getElementById('bordergt'),
  eval: document.getElementById('bordereval'),
  after: document.getElementById('borderifa'),
  before: document.getElementById('borderifb'),
}

;[nrows, ncols, grayscale, alpha, ...Object.values(border)].forEach(input => {
  input.onchange = run
})

;[nrows, ncols, border.diff, border.eval].forEach(input => {
  input.oninput = run
})

const photo = document.getElementById('photo')
photo.onchange = async function() {
  image = await loadImage.call(photo)
  run()
}

async function run() {
  if (!image) {
    throw Error('Choose an image to run')
  }
  
  await distort({
    image,
    canvas: output,
    rows: +nrows.value,
    cols: +ncols.value,
    grayscale: grayscale.checked,
    alpha: alpha.checked,
    border: {
      h: border.h.checked,
      v: border.v.checked,
      diff: +border.diff.value,
      lt: border.lt.checked,
      gt: border.gt.checked,
      eval: +border.eval.value,
      after: border.after.checked,
      before: border.before.checked,
    }
  })
}
