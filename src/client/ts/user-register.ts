import { Form, linkSubmitHandler } from '@client/dom'
import { UserRegisterForm } from '@common/type/user-form'
import { postData } from '@client/fetch'

export function initUserRegisterPage() {
  linkSubmitHandler('#registerForm', submit)
}

function submit(form: Form) {
  const data: UserRegisterForm = {
    name: form.input.name.value,
    email: form.input.email.value,
    password: form.input.password.value,
  }
  postData('/api/user-register', form, data, body => {
    window.location.href = '/user-register-done'
  })
}
