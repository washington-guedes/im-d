import { make } from '../utils/make';
import { Pixel } from './pixel';

let running = false;

export function distortImage({
  canvas = new HTMLCanvasElement(),
  input = null,
  rows = 8,
  cols = 8,
  avgR = false,
  avgG = false,
  avgB = false,
  avgA = false,
  log = true,
} = {}) {
  if (running) {
    throw Error('Already running');
  }
  if (rows < 1 || cols < 1) {
    throw Error('Invalid block size');
  }

  const inputHeight = input.height || input.videoHeight || canvas.height;
  const inputWidth = input.width || input.videoWidth || canvas.width;

  rows = Math.min(rows, inputHeight);
  cols = Math.min(cols, inputWidth);

  const actionLabel = (() => {
    let label = `${rows} rows, ${cols} cols`;
    if (avgR) label += ', avgR';
    if (avgG) label += ', avgG';
    if (avgB) label += ', avgB';
    if (avgA) label += ', avgA';
    return label;
  })();

  running = true;
  if (log) console.time(actionLabel);

  canvas.height = inputHeight;
  canvas.width = inputWidth;

  const ctx = canvas.getContext('2d');
  ctx.drawImage(input, 0, 0);

  const imageData = ctx.getImageData(0, 0, inputWidth, inputHeight);
  const { data: pixels } = imageData;

  const arr = make(rows, () => make(cols, () => new Pixel()));
  const rowHeight = Math.ceil(inputHeight / rows);
  const colWidth = Math.ceil(inputWidth / cols);

  const loop = (fn) => {
    let row = 0;
    let rowlimit = rowHeight;

    for (let i = 0; i < inputHeight; i += 1) {
      const past = i * inputWidth * 4;
      if (i === rowlimit) {
        row += 1;
        rowlimit += rowHeight;
      }

      let col = 0;
      let collimit = colWidth;

      for (let j = 0, px = 0; j < inputWidth; j += 1, px += 4) {
        if (j >= collimit) {
          col += 1;
          collimit += colWidth;
        }
        fn(past + px, arr[row][col]);
      }
    }
  };

  loop((k, item) => {
    item.add(pixels[k], pixels[k + 1], pixels[k + 2], pixels[k + 3]);
  });

  let groupedKey = '';
  if (avgR) groupedKey += 'r';
  if (avgG) groupedKey += 'g';
  if (avgB) groupedKey += 'b';
  if (avgA) groupedKey += 'a';

  loop((k, item) => {
    const groupedAvg = item.avg(groupedKey);
    pixels[k] = avgR ? groupedAvg : item.avg('r');
    pixels[k + 1] = avgG ? groupedAvg : item.avg('g');
    pixels[k + 2] = avgB ? groupedAvg : item.avg('b');
    pixels[k + 3] = avgA ? groupedAvg : item.avg('a');
  });

  ctx.putImageData(imageData, 0, 0);

  if (log) console.timeEnd(actionLabel);
  running = false;

  return canvas;
}

export default distortImage;
