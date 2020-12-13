window.imageDistortion.createDefaultUI({
  wrapper: document.getElementById('image-distortion--wrapper'),
  log: true,
  image: (() => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = 'https://images-na.ssl-images-amazon.com/images/I/41HXUK8edZL.png';
    return img;
  })(),
});
