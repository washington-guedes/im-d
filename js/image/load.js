async function loadImage() {
  if (!this.files || !this.files[0]) {
    throw Error('Missing photo')
  }
  
  console.time('loading image')
  const image = new Image()

  let resolve
  const promise = new Promise(of => resolve = of)

  image.onload = function () {
    console.timeEnd('loading image')
    resolve(image)
  }
  
  const _in = new FileReader()
  _in.onload = () => image.src = _in.result
  _in.readAsDataURL(this.files[0])

  return promise
}
