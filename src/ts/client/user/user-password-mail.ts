import { Form, grabForm, linkSubmitHandler } from '@client/util/form'
import { sendPost } from '@client/util/fetch'

export function initUserPasswordMailForm() {
  const form = grabForm('form')
  linkSubmitHandler(form, post, result)
}

function post(form: Form) {
  const data = {
    email: form.input.email.value
  }
  return sendPost('/api/user-password-mail', data)
}

function result(body: any) {
  window.location.href = '/user-password-mail-done'
}
