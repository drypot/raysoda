import { Form, grabForm, linkSubmitHandler } from '@client/util/form'
import { UserLoginForm } from '@common/type/user-form'
import { sendPost } from '@client/util/fetch'

export function initUserLoginForm() {
  const form = grabForm('form')
  linkSubmitHandler(form, submit, result)
}

function submit(form: Form) {
  const data: UserLoginForm = {
    email: form.input.email.value,
    password: form.input.password.value,
    remember: form.input.remember.checked
  }
  return sendPost('/api/user-login', data)
}

function result(body: any) {
  window.location.href = '/'
}
