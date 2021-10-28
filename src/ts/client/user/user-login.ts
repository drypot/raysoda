import { Form, linkSubmitHandler } from '@client/util/form'
import { UserLoginForm } from '@common/type/user-form'
import { sendPost } from '@client/util/fetch'

export function initUserLoginForm() {
  linkSubmitHandler('#loginForm', submit)
}

function submit(form: Form) {
  const data: UserLoginForm = {
    email: form.input.email.value,
    password: form.input.password.value,
    remember: form.input.remember.checked
  }
  sendPost('/api/user-login', form, data, body => {
    window.location.href = '/'
  })
}














