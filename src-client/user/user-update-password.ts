import type { UpdateUserPasswordForm } from "../../src/common/type/user-form.ts"
import { newNumber } from "../../src/common/util/primitive.ts"
import { pathList } from "../util/context.ts"
import { sendPut } from "../util/fetch.ts"
import { grabForm, linkSubmitHandler, type Form } from "../util/form.ts"

export function initUserUpdatePassword() {
  const form = grabForm('form')
  linkSubmitHandler(form, submit, result)
}

function submit(form: Form) {
  const data: UpdateUserPasswordForm = {
    id: newNumber(pathList[1]),
    password: form.input.password.value
  }
  return sendPut('/api/user-update-password', data)
}

function result(body: any) {
  window.location.href = '/user-update-done/' + pathList[1]
}

