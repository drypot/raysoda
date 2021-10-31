import { Form, submitHelper } from '@client/util/form'
import { postJson } from '@client/util/fetch'

export function initUserPasswordMailForm() {
  submitHelper('#mailForm', post, result)
}

function post(form: Form) {
  const data = {
    email: form.input.email.value
  }
  return postJson('/api/user-password-mail', data)
}

function result(body: any) {
  window.location.href = '/user-password-mail-done'
}
