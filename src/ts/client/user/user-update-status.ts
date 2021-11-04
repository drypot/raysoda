import { Form, getInputRadioValue, grabForm, linkSubmitHandler, setInputRadioChecked } from '@client/util/form'
import { UserUpdateStatusForm } from '@common/type/user-form'
import { sendPut } from '@client/util/fetch'
import { pathSlice } from '@client/util/context'
import { newNumber } from '@common/util/primitive'
import { getEmbeddedJson } from '@client/util/dom'

export function initUserUpdateStatus() {
  const form = grabForm('form')
  const data = getEmbeddedJson('formJson')
  setInputRadioChecked(form, 'status', data.status)
  linkSubmitHandler(form, submit, result)
}

function submit(form: Form) {
  const data: UserUpdateStatusForm = {
    id: newNumber(pathSlice[1]),
    status: getInputRadioValue(form, 'status') === 'v' ? 'v' : 'd'
  }
  return sendPut('/api/user-update-status', data)
}

function result(body: any) {
  window.location.href = '/user-update-done/' + pathSlice[1]
}
