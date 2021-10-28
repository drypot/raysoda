import { Form, linkSubmitHandler } from '@client/util/form'
import { sendPost } from '@client/util/fetch'
import { pathSlice } from '@client/util/context'
import { NewPasswordForm } from '@common/type/password'
import { newNumber, newString } from '@common/util/primitive'

export function initUserPasswordMailForm() {
  linkSubmitHandler('#mailForm', submitEmail)
}

function submitEmail(form: Form) {
  const data = {
    email: form.input.email.value
  }
  sendPost('/api/user-password-mail', form, data, body => {
    window.location.href = '/user-password-mail-done'
  })
}

export function initUserPasswordResetForm() {
  linkSubmitHandler('#resetForm', submitPassword)
}

function submitPassword(form: Form) {
  const data: NewPasswordForm = {
    id: newNumber(pathSlice[1]),
    random: newString(pathSlice[2]),
    password: form.input.password.value,
  }
  sendPost('/api/user-password-reset', form, data, body => {
    window.location.href = '/user-password-reset-done'
  })
}

// cuser.initResetPassStep1 = function () {
//   let $form = formty.getForm('form.main')
//   $form.$email.focus()
//   $form.$send.click(function () {
//     formty.post('/api/user-password-mail', $form, function () {
//       location = '/password-reset-2'
//     })
//     return false
//   })
// }
//
// cuser.initResetPassStep3 = function () {
//   let $form = formty.getForm('form.main')
//   $form.$password.focus()
//   $form.$send.click(function () {
//     formty.put('/api/password-reset', $form, { uuid: url.query.uuid, token: url.query.t }, function () {
//       location = '/user-login'
//     })
//     return false
//   })
// }












