import { domQueryAll, newElementFromHtml } from '@client/util/dom'
import { tagUp } from '@common/util/tagup'
import { fsEnabled, fsExit, fsRequest, fsWidth, fsWrapper } from '@client/util/fullscreen'

export function initImageList() {

  // sessionStorage.setItem('last-list-url', location)
  tagUpComments()
  addFullscreenIcons()
}

function tagUpComments() {
  const comments = domQueryAll('.image-card .comment')
  Array.from(comments).forEach(comment => {
    comment.innerHTML = tagUp(comment.innerHTML)
  })
}

const fsIconTag = `<svg xmlns="http://www.w3.org/2000/svg" class="fs-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
</svg>`

function addFullscreenIcons() {
  if (!fsEnabled) return
  const imgs = domQueryAll('.image-card img')
  Array.from(imgs).forEach(img => {
    const imgUrl = findFSImage(img)
    const icon = newElementFromHtml(fsIconTag)
    icon.onclick = function (e) {
      openFSImage(imgUrl)
      e.preventDefault()
    }
    img.parentElement?.prepend(icon)
  })
}

function findFSImage(img: Element) {
  const src = img.getAttribute('src') as string
  const split = src.split('-')

  // Not Rapixel
  if (split.length ===1) return src

  // Rapixel
  const vers = (img as HTMLElement).dataset.vers?.split(',') as string[]
  const minWidth = Math.max(fsWidth, 2560) // rapixel 섬네일 사이즈가 2560
  let i = 0
  while(i + 1 < vers.length && Number(vers[i + 1]) >= minWidth) i++
  return split[0] + '-' + vers[i] + '.jpg'
}

function openFSImage(url: string) {
  const img = newElementFromHtml('<img src="' + url +'">')
  img.onclick = function(e) {
    fsExit()
    e.preventDefault()
  }
  fsWrapper.append(img)
  fsRequest(img)
}