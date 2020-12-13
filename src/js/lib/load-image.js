export async function loadImage({ log }) {
  if (!this.files || !this.files[0]) {
    throw Error('Missing photo');
  }

  if (log) console.time('loading image');
  const image = new Image();

  let resolve;
  const promise = new Promise((of) => {
    resolve = of;
  });

  image.onload = function onload() {
    if (log) console.timeEnd('loading image');
    resolve(image);
  };

  const fileReader = new FileReader();
  fileReader.onload = () => {
    image.src = fileReader.result;
  };
  fileReader.readAsDataURL(this.files[0]);

  return promise;
}

export default loadImage;
