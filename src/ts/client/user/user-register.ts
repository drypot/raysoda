import { Form, submitHelper, } from '@client/util/form'
import { UserRegisterForm } from '@common/type/user-form'
import { postJson } from '@client/util/fetch'

export function initUserRegisterForm() {
  submitHelper('#registerForm', submit, result)
}

function submit(form: Form) {
  const data: UserRegisterForm = {
    email: form.input.email.value,
    password: form.input.password.value,
  }
  return postJson('/api/user-register', data)
}

function result(body: any) {
  window.location.href = '/user-register-done'
}
