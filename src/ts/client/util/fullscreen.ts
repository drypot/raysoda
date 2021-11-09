import { getElementById } from '@client/util/dom'

export const fsWidth = window.screen.width * (window.devicePixelRatio || 1)
export const fsElement = getElementById("fullscreen")

const documentAny = document as any

export const fsEnabled =
  documentAny.fullscreenEnabled ||
  documentAny.webkitFullscreenEnabled ||
  documentAny.mozFullScreenEnabled ||
  documentAny.msFullscreenEnabled

export function fsRequest(el: HTMLElement) {
  const elAny = el as any;
  (elAny.requestFullscreen ||
    elAny.webkitRequestFullscreen ||
    elAny.mozRequestFullScreen ||
    elAny.msRequestFullscreen
  ).call(elAny)
}

export function fsExit() {
  (documentAny.exitFullscreen ||
    documentAny.mozCancelFullScreen ||
    documentAny.webkitExitFullscreen ||
    documentAny.msExitFullscreen
  ).call(documentAny)
}

document.addEventListener('fullscreenchange', onChangeHandler)
document.addEventListener('mozfullscreenchange', onChangeHandler)
document.addEventListener('webkitfullscreenchange', onChangeHandler)
document.addEventListener('MSFullscreenChange', onChangeHandler)

function onChangeHandler() {
  if (!fsInFullscreen()) {
    fsElement.textContent = ''
  }
}

function fsInFullscreen() {
  return fsEnabled && !!(
    documentAny.fullscreenElement ||
    documentAny.mozFullScreenElement ||
    documentAny.webkitFullscreenElement ||
    documentAny.msFullscreenElement
  )
}
