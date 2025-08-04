import type { UpdateUserStatusForm } from "../../src/common/type/user-form.ts"
import { user } from "../util/context.ts"
import { sendPut } from "../util/fetch.ts"
import { grabForm, linkSubmitHandler, type Form } from "../util/form.ts"
import { openRedModal, MODAL_OK } from "../util/modal.ts"

export function initUserDeactivateForm() {
  const form = grabForm('form')
  linkSubmitHandler(form, submit, result)
}

function submit(form: Form) {
  return new Promise((resolve, reject) => {
    openRedModal('계정 사용 중지 재확인', '계정이 사용 중지되면 더이상 로그인하실 수 없습니다.', '계정 사용 중지', (r) => {
      if (r === MODAL_OK) {
        const data: UpdateUserStatusForm = {
          id: user.id,
          status: 'd'
        }
        resolve(sendPut('/api/user-update-status', data))
      } else {
        reject()
      }
    })
  })
}

function result(body: any) {
  window.location.href = '/user-deactivate-done'
}
