import { domQueryAll } from '@client/util/dom'
import { tagUp } from '@common/util/tagup'
import { fsEnabled } from '@client/util/fullscreen'
import { addFSIcon } from '@client/image/image-fullscreen'

export function initImageList() {
  // sessionStorage.setItem('last-list-url', location)
  tagUpComments()
  addFSIcons()
}

function tagUpComments() {
  const comments = domQueryAll('.image-card .comment')
  Array.from(comments).forEach(comment => {
    comment.innerHTML = tagUp(comment.innerHTML)
  })
}

function addFSIcons() {
  if (!fsEnabled) return
  const imgs = domQueryAll('.image-card img')
  Array.from(imgs).forEach(img => {
    addFSIcon(img)
  })
}
