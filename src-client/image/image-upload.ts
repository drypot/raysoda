import { sendPost } from "../util/fetch.ts"
import { grabForm, linkSubmitHandler, type Form } from "../util/form.ts"
import { startPing } from "../util/ping.ts"

export function initImageUpload() {
  const form = grabForm('form')
  linkSubmitHandler(form, submit, result)
  startPing()
}

function submit(form: Form) {
  const data = new FormData(form.form)
  return sendPost('/api/image-upload', data)
}

function result(body: any) {
  window.location.href = '/'
}
