import { tagUp } from "../../src/common/util/tagup.ts"
import { pathList } from "../util/context.ts"
import { getElementById, domQuery } from "../util/dom.ts"
import { sendDelete } from "../util/fetch.ts"
import { openRedModal, MODAL_OK, openErrorModal } from "../util/modal.ts"
import { setRefresh } from "../util/refresh.ts"
import { fillFSIcon } from "./image-fullscreen.ts"

export function initImageDetail() {
  const img = getElementById('image')
  img.onclick = (e) => {
    e.preventDefault()
    window.history.back()
  }

  fillFSIcon(domQuery('.fs-icon') as HTMLElement)

  const comment = getElementById('comment')
  comment.innerHTML = tagUp(comment.innerHTML)

  const updateBtn = getElementById('update-btn')
  updateBtn.onclick = (e) => {
    e.preventDefault()
    window.location.href = '/image-update/' + pathList[1]
  }

  const deleteBtn = getElementById('delete-btn')
  deleteBtn.onclick = (e) => {
    e.preventDefault()
    openRedModal('사진 삭제 확인', '삭제된 사진은 복구하실 수 없습니다', '삭제', result => {
      if (result === MODAL_OK) {
        sendDelete('/api/image-delete/' + pathList[1]).then(body => {
          if (body.err) throw body.err[0]
          setRefresh()
          window.history.back()
        }).catch(openErrorModal)
      }
    })
  }

}
