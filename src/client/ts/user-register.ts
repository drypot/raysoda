import { clearFormError, ControlMap, disableSubmit, enableSubmit, grabForm, reportFormError } from '@client/dom'
import { UserRegisterForm } from '@common/type/user-form'
import { openErrorModal } from '@client/modal'
import { checkResponseError } from '@client/fetch'

export function initUserRegisterPage() {
  const form = grabForm('#registerForm')
  form.send.onclick = (e) => {
    sendForm(form)
    e.preventDefault()
  }
}

function sendForm(form: ControlMap) {
  const data: UserRegisterForm = {
    name: (form.name as HTMLInputElement).value,
    email: (form.email as HTMLInputElement).value,
    password: (form.password as HTMLInputElement).value,
  }
  const opt: RequestInit = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }
  clearFormError(form.form)
  disableSubmit(form.send)
  fetch('/api/user-register', opt)
    .then(checkResponseError)
    .then(res => res.json())
    .then(body => {
      if (body.err) {
        enableSubmit(form.send)
        reportFormError(form, body.err)
        return
      }
      console.log('Success')
      // window.location = '/user-register-done'
    })
    .catch(err => {
      openErrorModal(err, () => {
        enableSubmit(form.send)
      })
    })
}
