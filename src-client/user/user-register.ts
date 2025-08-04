import type { UserRegisterForm } from "../../src/common/type/user-form.ts"
import { sendPost } from "../util/fetch.ts"
import { grabForm, linkSubmitHandler, type Form } from "../util/form.ts"

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
