import { domQueryAll } from '@client/util/dom'
import { tagUp } from '@common/util/tagup'
import { fsEnabled } from '@client/util/fullscreen'
import { fillFSIcon } from '@client/image/image-fullscreen'

export function initImageList() {
  tagUpComments()
  addFSIcons()
}

function tagUpComments() {
  domQueryAll('.comment').forEach(el => {
    el.innerHTML = tagUp(el.innerHTML)
  })
}

function addFSIcons() {
  if (!fsEnabled) return
  domQueryAll('.fs-icon').forEach(el => {
    fillFSIcon(el)
  })
}
