import { clearFormError, disableSubmit, enableSubmit, grabForm, HTMLElementMap, reportFormError } from '@client/dom'
import { UserLoginForm } from '@common/type/user-form'
import { openErrorModal } from '@client/modal'
import { checkResponseError } from '@client/fetch'

export function initUserLoginPage() {
  const form = grabForm('#loginForm')
  form.send.onclick = (e) => {
    sendUserLoginForm(form)
    e.preventDefault()
  }
}

export function click2() {
  const form = grabForm('#loginForm')
  enableSubmit(form.send)
}

function sendUserLoginForm(form: HTMLElementMap) {
  const data: UserLoginForm = {
    email: (form.email as HTMLInputElement).value,
    password: (form.password as HTMLInputElement).value,
    remember: (form.remember as HTMLInputElement).checked
  }
  const opt: RequestInit = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }
  clearFormError(form)
  disableSubmit(form.send)
  fetch('/api/user-login', opt)
    .then(checkResponseError)
    .then(res => res.json())
    .then(body => {
      if (body.err) {
        enableSubmit(form.send)
        reportFormError(form, body)
        return
      }
      console.log('Success')
      // window.location = '/'
    })
    .catch(err => {
      openErrorModal(err, () => {
        enableSubmit(form.send)
      })
    })
}
