import { Form, submitHelper } from '@client/util/form'
import { UserLoginForm } from '@common/type/user-form'
import { postJson } from '@client/util/fetch'

export function initUserLoginForm() {
  submitHelper('#loginForm', submit, result)
}

function submit(form: Form) {
  const data: UserLoginForm = {
    email: form.input.email.value,
    password: form.input.password.value,
    remember: form.input.remember.checked
  }
  return postJson('/api/user-login', data)
}

function result(body: any) {
  window.location.href = '/'
}
