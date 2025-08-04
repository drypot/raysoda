import type { UpdateImageForm } from "../../src/common/type/image-form.ts"
import { newString } from "../../src/common/util/primitive.ts"
import { getEmbeddedJson } from "../util/dom.ts"
import { sendPut } from "../util/fetch.ts"
import { grabForm, linkSubmitHandler, type Form } from "../util/form.ts"
import { startPing } from "../util/ping.ts"
import { setRefresh } from "../util/refresh.ts"

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
