export async function loadImage({ log }) {
  if (!this.files || !this.files[0]) {
    throw Error('Missing photo')
  }
  
  if (log) console.time('loading image')
  const image = new Image()
  
  let resolve
  const promise = new Promise(of => resolve = of)
  
  image.onload = function () {
    if (log) console.timeEnd('loading image')
    resolve(image)
  }
  
  const _in = new FileReader()
  _in.onload = () => image.src = _in.result
  _in.readAsDataURL(this.files[0])
  
  return promise
}
