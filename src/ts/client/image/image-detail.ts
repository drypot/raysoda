import { domQuery, getElementById } from '@client/util/dom'
import { fillFSIcon } from '@client/image/image-fullscreen'
import { tagUp } from '@common/util/tagup'
import { pathList } from '@client/util/context'
import { MODAL_OK, openErrorModal, openRedModal } from '@client/util/modal'
import { sendDelete } from '@client/util/fetch'
import { setRefresh } from '@client/util/refresh'

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
