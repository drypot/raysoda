import { Form, getInputRadioValue, grabForm, linkSubmitHandler, setInputRadioChecked } from '@client/util/form'
import { UpdateUserStatusForm } from '@common/type/user-form'
import { sendPut } from '@client/util/fetch'
import { pathList } from '@client/util/context'
import { newNumber } from '@common/util/primitive'
import { getEmbeddedJson } from '@client/util/dom'

export function initUserUpdateStatus() {
  const form = grabForm('form')
  fillForm(form)
  linkSubmitHandler(form, submit, result)
}

function fillForm(form: Form) {
  const data = getEmbeddedJson('formJson')
  setInputRadioChecked(form, 'status', data.status)
}

function submit(form: Form) {
  const data: UpdateUserStatusForm = {
    id: newNumber(pathList[1]),
    status: getInputRadioValue(form, 'status') === 'v' ? 'v' : 'd'
  }
  return sendPut('/api/user-update-status', data)
}

function result(body: any) {
  window.location.href = '/user-update-done/' + pathList[1]
}
