import { startPing } from '@client/util/ping'
import { Form, grabForm, linkSubmitHandler } from '@client/util/form'
import { sendPost } from '@client/util/fetch'

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
