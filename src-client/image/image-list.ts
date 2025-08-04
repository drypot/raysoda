import { tagUp } from "../../src/common/util/tagup.ts"
import { domQueryAll } from "../util/dom.ts"
import { fsEnabled } from "../util/fullscreen.ts"
import { fillFSIcon } from "./image-fullscreen.ts"


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
