import { Form, grabForm, linkSubmitHandler } from '@client/util/form'
import { UserUpdateProfileForm } from '@common/type/user-form'
import { sendPut } from '@client/util/fetch'
import { pathSlice } from '@client/util/context'
import { newNumber } from '@common/util/primitive'
import { getEmbeddedJson } from '@client/util/dom'

export function initUserUpdateProfile() {
  const form = grabForm('form')
  const data = getEmbeddedJson('formJson')
  form.input.name.value = data.user.name
  form.input.home.value = data.user.home
  form.input.email.value = data.user.email
  form.textarea.profile.value = data.user.profile
  linkSubmitHandler(form, submit, result)
}

function submit(form: Form) {
  const data: UserUpdateProfileForm = {
    id: newNumber(pathSlice[1]),
    name: form.input.name.value,
    home: form.input.home.value,
    email: form.input.email.value,
    profile: form.textarea.profile.value
  }
  return sendPut('/api/user-update-profile', data)
}

function result(body: any) {
  window.location.href = '/user-update-done/' + pathSlice[1]
}
