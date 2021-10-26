import { Form, linkSubmitHandler } from '@client/dom'
import { UserLoginForm } from '@common/type/user-form'
import { postData } from '@client/fetch'

export function initUserLoginPage() {
  linkSubmitHandler('#loginForm', submit)
}

function submit(form: Form) {
  const data: UserLoginForm = {
    email: form.input.email.value,
    password: form.input.password.value,
    remember: form.input.remember.checked
  }
  postData('/api/user-login', form, data, body => {
    window.location.href = '/'
  })
}
