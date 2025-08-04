import { newElementFromHtml } from "../util/dom.ts"
import { fsWidth, fsElement, fsExit, fsRequest } from "../util/fullscreen.ts"

const fsIconTag = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="gray">
<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
</svg>`

export function fillFSIcon(iconHolder: HTMLElement) {
  const url = findImageUrl(iconHolder)
  iconHolder.innerHTML = fsIconTag
  const icon = iconHolder.firstElementChild as HTMLElement
  icon.onclick = function (e) {
    openImage(url)
    e.preventDefault()
  }
  iconHolder.append(icon)
}

function findImageUrl(icon: HTMLElement) {
  const img = icon.parentElement?.querySelector('img') as HTMLElement
  const src = img.getAttribute('src') as string
  const split = src.split('-')

  // Not Rapixel
  if (split.length === 1) return src

  // Rapixel
  const vers = (img as HTMLElement).dataset.vers?.split(',') as string[]
  const minWidth = Math.max(fsWidth, 2560) // rapixel 섬네일 사이즈가 2560
  let i = 0
  while (i + 1 < vers.length && Number(vers[i + 1]) >= minWidth) i++
  return split[0] + '-' + vers[i] + '.jpg'
}

function openImage(url: string) {
  const img = newElementFromHtml('<img src="' + url + '" class="img-full">')
  fsElement.textContent = ''
  fsElement.append(img)
  fsElement.onclick = img.onclick = function (e) {
    fsExit()
    e.preventDefault()
  }
  fsRequest(fsElement)
}
