import { Form, grabForm, linkSubmitHandler } from '@client/util/form'
import { sendPost } from '@client/util/fetch'
import { pathList } from '@client/util/context'
import { NewPasswordForm } from '@common/type/password'
import { newNumber, newString } from '@common/util/primitive'

export function initUserPasswordResetForm() {
  const form = grabForm('form')
  linkSubmitHandler(form, post, result)
}

function post(form: Form) {
  const data: NewPasswordForm = {
    id: newNumber(pathList[1]),
    random: newString(pathList[2]),
    password: form.input.password.value,
  }
  return sendPost('/api/user-password-reset', data)
}

function result(body: any) {
  window.location.href = '/user-password-reset-done'
}
