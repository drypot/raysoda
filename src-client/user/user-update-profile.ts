import type { UpdateUserProfileForm } from "../../src/common/type/user-form.ts"
import { newNumber } from "../../src/common/util/primitive.ts"
import { pathList } from "../util/context.ts"
import { getEmbeddedJson } from "../util/dom.ts"
import { sendPut } from "../util/fetch.ts"
import { grabForm, linkSubmitHandler, type Form } from "../util/form.ts"

export function initUserUpdateProfile() {
  const form = grabForm('form')
  fillForm(form)
  linkSubmitHandler(form, submit, result)
}

function fillForm(form: Form) {
  const data = getEmbeddedJson('formJson')
  form.input.name.value = data.user.name
  form.input.home.value = data.user.home
  form.input.email.value = data.user.email
  form.textarea.profile.value = data.user.profile
}

function submit(form: Form) {
  const data: UpdateUserProfileForm = {
    id: newNumber(pathList[1]),
    name: form.input.name.value,
    home: form.input.home.value,
    email: form.input.email.value,
    profile: form.textarea.profile.value
  }
  return sendPut('/api/user-update-profile', data)
}

function result(body: any) {
  window.location.href = '/user-update-done/' + pathList[1]
}
