import { startPing } from '@client/util/ping'
import { Form, grabForm, linkSubmitHandler } from '@client/util/form'
import { sendPut } from '@client/util/fetch'
import { getEmbeddedJson } from '@client/util/dom'
import { UpdateImageForm } from '@common/type/image-form'
import { newString } from '@common/util/primitive'
import { setRefresh } from '@client/util/refresh'

export function initImageUpdate() {
  const form = grabForm('form')
  fillForm(form)
  linkSubmitHandler(form, submit, result)
  startPing()
}

function fillForm(form: Form) {
  const data = getEmbeddedJson('formJson')
  const image = data.image as UpdateImageForm
  form.input.id.value = newString(image.id)
  form.textarea.comment.value = image.comment
}

function submit(form: Form) {
  const data = new FormData(form.form)
  return sendPut('/api/image-update', data)
}

function result(body: any) {
  setRefresh()
  window.history.back()
}
