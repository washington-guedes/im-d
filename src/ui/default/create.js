import { runDistortion, loadImageFromInputFile } from '../..'
import * as Component from './component.html'
import './style.scss'

export function create({ wrapper, log, image, rows, cols, avgR, avgG, avgB, avgA } = {}) {
  wrapper.innerHTML = Component
  
  const __file =  wrapper.querySelector('.im-d__file')
  const __rows = wrapper.querySelector('.im-d__filter-rows .im-d__number')
  const __cols = wrapper.querySelector('.im-d__filter-cols .im-d__number')
  const __avgR = wrapper.querySelector('.im-d__checkbox-r')
  const __avgG = wrapper.querySelector('.im-d__checkbox-g')
  const __avgB = wrapper.querySelector('.im-d__checkbox-b')
  const __avgA = wrapper.querySelector('.im-d__checkbox-a')
  const __canvas = wrapper.querySelector('.im-d__canvas')
  
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
  if (image) image.onload = () => {
    image = image
    __rows.max = image.height
    __cols.max = image.width
    run()
  }
  
  function run() {
    runDistortion({
      image,
      canvas: __canvas,
      avgR: __avgR.checked,
      avgG: __avgG.checked,
      avgB: __avgB.checked,
      avgA: __avgA.checked,
      rows: +__rows.value,
      cols: +__cols.value,
      log
    })
  }
}
