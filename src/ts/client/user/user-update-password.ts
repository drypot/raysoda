import { Form, grabForm, linkSubmitHandler } from '@client/util/form'
import { UserUpdatePasswordForm } from '@common/type/user-form'
import { putJson } from '@client/util/fetch'
import { pathSlice } from '@client/util/context'
import { newNumber } from '@common/util/primitive'

export function initUserUpdatePassword() {
  const form = grabForm('form')
  linkSubmitHandler(form, submit, result)
}

function submit(form: Form) {
  const data: UserUpdatePasswordForm = {
    id: newNumber(pathSlice[1]),
    password: form.input.password.value
  }
  return putJson('/api/user-update-password', data)
}

function result(body: any) {
  window.location.href = '/user-update-done/' + pathSlice[1]
}
