import { startPing } from '@client/util/ping'
import { Form, grabForm, linkSubmitHandler } from '@client/util/form'
import { sendPut } from '@client/util/fetch'
import { getEmbeddedJson } from '@client/util/dom'
import { ImageUpdateForm } from '@common/type/image-form'
import { newString } from '@common/util/primitive'
import { setRefresh } from '@client/util/refresh'

export function initImageUpdate() {
  const form = grabForm('form')
  const data = getEmbeddedJson('formJson')
  const image = data.image as ImageUpdateForm
  form.input.id.value = newString(image.id)
  form.textarea.comment.value = image.comment
  linkSubmitHandler(form, submit, result)
  startPing()
}

function submit(form: Form) {
  const data = new FormData(form.form)
  return sendPut('/api/image-update', data)
}

function result(body: any) {
  setRefresh()
  window.history.back()
}
