import { distortImage } from '../../js/lib/distort-image';
import { loadImage } from '../../js/lib/load-image';
import * as Component from './component.html';
import './style.scss';

export function create({
  wrapper = new HTMLDivElement(),
  image = null,
  stream = true,
  rows = 8,
  cols = 8,
  avgR = false,
  avgG = false,
  avgB = false,
  avgA = false,
  log = false,
} = {}) {
  wrapper.innerHTML = Component;

  const $file = wrapper.querySelector('.im-d__file');
  const $checkboxStream = wrapper.querySelector('.im-d__filter-stream .im-d__checkbox');
  const $rows = wrapper.querySelector('.im-d__filter-rows .im-d__number');
  const $cols = wrapper.querySelector('.im-d__filter-cols .im-d__number');
  const $avgR = wrapper.querySelector('.im-d__checkbox-r');
  const $avgG = wrapper.querySelector('.im-d__checkbox-g');
  const $avgB = wrapper.querySelector('.im-d__checkbox-b');
  const $avgA = wrapper.querySelector('.im-d__checkbox-a');
  const $canvas = wrapper.querySelector('.im-d__canvas');
  const $video = wrapper.querySelector('.im-d__video');

  const runDistortion = () => {
    distortImage({
      image: $checkboxStream.checked ? $video : image,
      canvas: $canvas,
      avgR: $avgR.checked,
      avgG: $avgG.checked,
      avgB: $avgB.checked,
      avgA: $avgA.checked,
      rows: +$rows.value,
      cols: +$cols.value,
      log,
    });
    if ($checkboxStream.checked) {
      setTimeout(runDistortion, 0);
    }
  };

  [$avgR, $avgG, $avgB, $avgA].forEach((input) => {
    input.onchange = () => runDistortion();
  });
  [$rows, $cols].forEach((input) => {
    input.oninput = () => runDistortion();
  });

  $file.onchange = async function onchange() {
    image = await loadImage.call($file, { log });
    $rows.max = image.height;
    $cols.max = image.width;
    runDistortion();
  };

  $rows.value = rows;
  $cols.value = cols;
  if (avgR) $avgR.checked = true;
  if (avgG) $avgG.checked = true;
  if (avgB) $avgB.checked = true;
  if (avgA) $avgA.checked = true;

  if (image) {
    image.onload = () => {
      $rows.max = image.height;
      $cols.max = image.width;
      runDistortion();
    };
  }

  $checkboxStream.onchange = getCheckboxStreamOnChangeHandler($video, $canvas, runDistortion);
  setCheckbox($checkboxStream, !!stream);
}

function getCheckboxStreamOnChangeHandler($video, runDistortion) {
  return async function onchange() {
    if (this.checked) {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
        $video.srcObject = mediaStream;
        $video.onloadedmetadata = () => {
          $video.play();
          runDistortion();
        };
      } catch (e) {
        setCheckbox({
          checkbox: this,
          checked: false,
        });
      }
    } else {
      stopVideo($video);
    }
  };
}

function setCheckbox($el, checked) {
  $el.checked = checked;
  $el.dispatchEvent(new Event('change'));
}

function stopVideo($el) {
  if ($el.srcObject) {
    $el.srcObject.getTracks().forEach((track) => track.stop());
  }
}

export default create;
