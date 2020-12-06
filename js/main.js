const output = document.getElementById('output')
let image

const nrows = document.getElementById('nrows')
const ncols = document.getElementById('ncols')
const grayscale = document.getElementById('grayscale')
const alpha = document.getElementById('alpha')

;[nrows, ncols, grayscale, alpha].forEach(input => {
  input.onchange = run
})

;[nrows, ncols].forEach(input => {
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
    alpha: alpha.checked
  })
}
