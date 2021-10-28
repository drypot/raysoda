import { Form, linkSubmitHandler } from '@client/util/form'
import { UserRegisterForm } from '@common/type/user-form'
import { sendPost } from '@client/util/fetch'

export function initUserRegisterForm() {
  linkSubmitHandler('#registerForm', submit)
}

function submit(form: Form) {
  const data: UserRegisterForm = {
    name: form.input.name.value,
    email: form.input.email.value,
    password: form.input.password.value,
  }
  sendPost('/api/user-register', form, data, body => {
    window.location.href = '/user-register-done'
  })
}
