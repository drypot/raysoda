import type { UserLoginForm } from "../../src/common/type/user-form.ts"
import { sendPost } from "../util/fetch.ts"
import { grabForm, linkSubmitHandler, type Form } from "../util/form.ts"

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
