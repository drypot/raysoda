import { Form, grabForm, linkSubmitHandler } from '@client/util/form'
import { UpdateUserProfileForm } from '@common/type/user-form'
import { sendPut } from '@client/util/fetch'
import { pathList } from '@client/util/context'
import { newNumber } from '@common/util/primitive'
import { getEmbeddedJson } from '@client/util/dom'

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
