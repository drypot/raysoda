import { Form, grabForm, linkSubmitHandler, } from '@client/util/form'
import { UserRegisterForm } from '@common/type/user-form'
import { sendPost } from '@client/util/fetch'

export function initUserRegisterForm() {
  const form = grabForm('form')
  linkSubmitHandler(form, submit, result)
}

function submit(form: Form) {
  const data: UserRegisterForm = {
    email: form.input.email.value,
    password: form.input.password.value,
  }
  return sendPost('/api/user-register', data)
}

function result(body: any) {
  window.location.href = '/user-register-done'
}
