import type { UpdateUserStatusForm } from "../../src/common/type/user-form.ts"
import { newNumber } from "../../src/common/util/primitive.ts"
import { pathList } from "../util/context.ts"
import { getEmbeddedJson } from "../util/dom.ts"
import { sendPut } from "../util/fetch.ts"
import { grabForm, linkSubmitHandler, type Form, setInputRadioChecked, getInputRadioValue } from "../util/form.ts"

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
