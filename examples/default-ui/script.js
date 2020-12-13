window.imageDistortion.createDefaultUI({
  wrapper: document.getElementById('image-distortion--wrapper'),
  log: true,
  image: (() => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = 'https://i1.sndcdn.com/avatars-000589154457-u2cvrc-t500x500.jpg';
    return img;
  })(),
});
