import { Form, grabForm, linkSubmitHandler } from '@client/util/form'
import { postJson } from '@client/util/fetch'
import { pathSlice } from '@client/util/context'
import { NewPasswordForm } from '@common/type/password'
import { newNumber, newString } from '@common/util/primitive'

export function initUserPasswordResetForm() {
  const form = grabForm('form')
  linkSubmitHandler(form, post, result)
}

function post(form: Form) {
  const data: NewPasswordForm = {
    id: newNumber(pathSlice[1]),
    random: newString(pathSlice[2]),
    password: form.input.password.value,
  }
  return postJson('/api/user-password-reset', data)
}

function result(body: any) {
  window.location.href = '/user-password-reset-done'
}
