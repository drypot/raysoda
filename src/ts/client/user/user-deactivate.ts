import { Form, grabForm, linkSubmitHandler } from '@client/util/form'
import { UserUpdateStatusForm } from '@common/type/user-form'
import { putJson } from '@client/util/fetch'
import { MODAL_OK, openRedModal } from '@client/util/modal'
import { user } from '@client/util/context'

export function initUserDeactivateForm() {
  const form = grabForm('form')
  linkSubmitHandler(form, submit, result)
}

function submit(form: Form) {
  return new Promise((resolve, reject) => {
    openRedModal('계정 사용 중지 재확인', '계정이 사용 중지되면 더이상 로그인하실 수 없습니다.', '계정 사용 중지', (r) => {
      if (r === MODAL_OK) {
        const data: UserUpdateStatusForm = {
          id: user.id,
          status: 'd'
        }
        resolve(putJson('/api/user-update-status', data))
      } else {
        reject()
      }
    })
  })
}

function result(body: any) {
  window.location.href = '/user-deactivate-done'
}
