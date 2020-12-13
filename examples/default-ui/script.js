window.imD.createDefaultUI({
  wrapper: document.getElementById('im-d--wrapper'),
  image: (() => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = 'https://i1.sndcdn.com/avatars-000589154457-u2cvrc-t500x500.jpg';
    return img;
  })(),
});
