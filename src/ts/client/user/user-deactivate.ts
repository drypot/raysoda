import { Form, linkSubmitHandler } from '@client/util/form'
import { UserUpdateStatusForm } from '@common/type/user-form'
import { sendPut } from '@client/util/fetch'
import { MODAL_OK, openRedModal } from '@client/util/modal'
import { user } from '@client/util/context'

export function initUserDeactivateForm() {
  linkSubmitHandler('#deactivateForm', submit)
}

function submit(form: Form) {
  openRedModal('계정 사용 중지 재확인', '계정이 사용 중지되면 더이상 로그인하실 수 없습니다.', '계정 사용 중지', (r) => {
    if (r === MODAL_OK) {
      const data: UserUpdateStatusForm = {
        id: user.id,
        status: 'd'
      }
      sendPut('/api/user-update-status', form, data, body => {
        window.location.href = '/user-deactivate-done'
      })
    }
  })
}
