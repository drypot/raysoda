import type { NewPasswordForm } from "../../src/common/type/password.ts"
import { newNumber, newString } from "../../src/common/util/primitive.ts"
import { pathList } from "../util/context.ts"
import { sendPost } from "../util/fetch.ts"
import { grabForm, linkSubmitHandler, type Form } from "../util/form.ts"

export function initUserPasswordResetForm() {
  const form = grabForm('form')
  linkSubmitHandler(form, post, result)
}

function post(form: Form) {
  const data: NewPasswordForm = {
    id: newNumber(pathList[1]),
    random: newString(pathList[2]),
    password: form.input.password.value,
  }
  return sendPost('/api/user-password-reset', data)
}

function result(body: any) {
  window.location.href = '/user-password-reset-done'
}
