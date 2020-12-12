import { runDistortion, loadImageFromInputFile } from '../..'
import * as Component from './component.html'
import './style.scss'

export function create({
  wrapper = new HTMLDivElement(),
  image = new Image(),
  stream = true,
  rows = 8,
  cols = 8,
  avgR = false,
  avgG = false,
  avgB = false,
  avgA = false,
  log = false
} = {}) {
  wrapper.innerHTML = Component
  
  const __file =  wrapper.querySelector('.im-d__file')
  const __checkboxStream = wrapper.querySelector('.im-d__filter-stream .im-d__checkbox')
  const __rows = wrapper.querySelector('.im-d__filter-rows .im-d__number')
  const __cols = wrapper.querySelector('.im-d__filter-cols .im-d__number')
  const __avgR = wrapper.querySelector('.im-d__checkbox-r')
  const __avgG = wrapper.querySelector('.im-d__checkbox-g')
  const __avgB = wrapper.querySelector('.im-d__checkbox-b')
  const __avgA = wrapper.querySelector('.im-d__checkbox-a')
  const __canvas = wrapper.querySelector('.im-d__canvas')
  const __video = wrapper.querySelector('.im-d__video')

  const run = () => runDistortion({
    image,
    canvas: __canvas,
    avgR: __avgR.checked,
    avgG: __avgG.checked,
    avgB: __avgB.checked,
    avgA: __avgA.checked,
    rows: +__rows.value,
    cols: +__cols.value,
    log
  });
  
  ;[__avgR, __avgG, __avgB, __avgA].forEach(input => {
    input.onchange = () => run()
  })
  ;[__rows, __cols].forEach(input => {
    input.oninput = () => run()
  })
  
  __file.onchange = async function() {
    image = await loadImageFromInputFile({
      inputFile: __file,
      log
    })
    __rows.max = image.height
    __cols.max = image.width
    run()
  }
  
  __rows.value = rows
  __cols.value = cols
  if (avgR) __avgR.checked = true
  if (avgG) __avgG.checked = true
  if (avgB) __avgB.checked = true
  if (avgA) __avgA.checked = true

  if (image) {
    image.onload = () => {
      image = image
      __rows.max = image.height
      __cols.max = image.width
      run()
    }
  }

  __checkboxStream.onchange = getCheckboxStreamOnChangeHandler(__video, __canvas)
  setCheckbox(__checkboxStream, !!stream)
}

function getCheckboxStreamOnChangeHandler(__video, __canvas) {
  return async function onchange() {
    stopVideo(__video)

    if (this.checked) {
      show(__video)
      hide(__canvas)

      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
        __video.srcObject = mediaStream
        __video.onloadedmetadata = () => __video.play()
      } catch (e) {
        setCheckbox(this, false)
      }

    } else {
      show(__canvas)
      hide(__video)
    }
  }
}

function show(__el) {
  __el.style.display = 'block'
}

function hide(__el) {
  __el.style.display = 'none'
}

function setCheckbox(__el, checked = true) {
  __el.checked = checked
  __el.dispatchEvent(new Event('change'))
}

function stopVideo(__el) {
  if (__el.srcObject) {
    __el.srcObject.getTracks().forEach(track => track.stop())
  }
}
