import { runDistortion, loadImageFromInputFile } from '../..'
import * as Component from './component.html'
import './style.scss'

export function create({ wrapper, log, image, rows, cols, grayscale, alpha } = {}) {
  wrapper.innerHTML = Component
  
  const __file =  wrapper.querySelector('.im-d__file')
  const __grayscale = wrapper.querySelector('.im-d__filter-grayscale > .im-d__checkbox')
  const __alpha = wrapper.querySelector('.im-d__filter-alpha > .im-d__checkbox')
  const __rows = wrapper.querySelector('.im-d__filter-rows > .im-d__number')
  const __cols = wrapper.querySelector('.im-d__filter-cols > .im-d__number')
  const __canvas = wrapper.querySelector('.im-d__canvas')
  
  ;[__grayscale, __alpha].forEach(input => {
    input.onchange = () => run()
  })
  ;[__rows, __cols].forEach(input => {
    input.oninput = () => run()
  })
  
  __file.onchange = async function() {
    image = await loadImageFromInputFile({
      inputFile: file,
      log
    })
    __rows.max = image.height
    __cols.max = image.width
    run()
  }
  
  __rows.value = rows
  __cols.value = cols
  if (grayscale) __grayscale.checked = true
  if (alpha) __alpha.checked = true
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
      grayscale: __grayscale.checked,
      alpha: __alpha.checked,
      rows: +__rows.value,
      cols: +__cols.value,
      log
    })
  }
}
