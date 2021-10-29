import { clearFormError, disableSubmitButton, enableSubmitButton, Form, reportFormError } from '@client/util/form'
import { openErrorModal } from '@client/util/modal'

export function sendPost(url: string, form: Form, data: any, cb: (data: any) => void) {
  const opt: RequestInit = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }
  clearFormError(form)
  disableSubmitButton(form)
  callFetch(url, opt, form, cb)
}

export function sendPut(url: string, form: Form, data: any, cb: (data: any) => void) {
  const opt: RequestInit = {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }
  clearFormError(form)
  disableSubmitButton(form)
  callFetch(url, opt, form, cb)
}

function callFetch(url: string, opt: RequestInit, form: Form, cb: (data: any) => void) {
  fetch(url, opt)
    .then(checkResponseError)
    .then(res => res.json())
    .then(body => {
      if (body.err) {
        enableSubmitButton(form)
        reportFormError(form, body.err)
        return
      }
      cb(body)
    })
    .catch(err => {
      openErrorModal(err, () => {
        enableSubmitButton(form)
      })
    })
}

function checkResponseError(res: Response) {
  if (res.status >= 200 && res.status <= 299) {
    return res
  } else {
    throw Error(res.statusText)
  }
}

