import { Form, grabForm, linkSubmitHandler } from '@client/util/form'
import { UpdateUserPasswordForm } from '@common/type/user-form'
import { sendPut } from '@client/util/fetch'
import { pathList } from '@client/util/context'
import { newNumber } from '@common/util/primitive'

export function initUserUpdatePassword() {
  const form = grabForm('form')
  linkSubmitHandler(form, submit, result)
}

function submit(form: Form) {
  const data: UpdateUserPasswordForm = {
    id: newNumber(pathList[1]),
    password: form.input.password.value
  }
  return sendPut('/api/user-update-password', data)
}

function result(body: any) {
  window.location.href = '/user-update-done/' + pathList[1]
}

