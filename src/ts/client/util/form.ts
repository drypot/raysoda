import { ErrorConst } from '@common/type/error'
import { openErrorModal } from '@client/util/modal'

export type Form = {
  form: HTMLFormElement,
  all: {
    [key: string]: HTMLElement
  }
  input: {
    [key: string]: HTMLInputElement
  },
  text: {
    [key: string]: HTMLTextAreaElement
  }
  select: {
    [key: string]: HTMLSelectElement
  }
  button: {
    [key: string]: HTMLButtonElement
  },
}

export function submitHelper(
  formQuery: string,
  callFetch: (form: Form) => Promise<any>,
  handleResult: (body: any) => void
) {
  const form = grabForm(formQuery)
  form.button.send.onclick = (e) => {
    submit()
    e.preventDefault()
  }
  return

  function submit() {
    clearFormError(form)
    disableSubmitButton(form)
    callFetch(form).then(body => {
      if (body.err) {
        reportFormError(form, body.err)
        enableSubmitButton(form)
        return
      }
      handleResult(body)
    }).catch(err => {
      if (err) {
        openErrorModal(err, () => {
          enableSubmitButton(form)
        })
      } else {
        enableSubmitButton(form)
      }
    })
  }
}

export function grabForm(query: string) {
  const form: Form = {
    form: document.querySelector(query) as HTMLFormElement,
    all: {},
    input: {},
    text: {},
    select: {},
    button: {}
  }
  Array.from(document.querySelectorAll(query + ' input')).forEach(el => {
    const name = el.getAttribute('name') as string
    form.input[name] = el as HTMLInputElement
    form.all[name] = el as HTMLElement
  })
  Array.from(document.querySelectorAll(query + ' textarea')).forEach(el => {
    const name = el.getAttribute('name') as string
    form.text[name] = el as HTMLTextAreaElement
    form.all[name] = el as HTMLElement
  })
  Array.from(document.querySelectorAll(query + ' select')).forEach(el => {
    const name = el.getAttribute('name') as string
    form.select[name] = el as HTMLSelectElement
    form.all[name] = el as HTMLElement
  })
  Array.from(document.querySelectorAll(query + ' button')).forEach(el => {
    const name = el.getAttribute('name') as string
    form.button[name] = el as HTMLButtonElement
    form.all[name] = el as HTMLElement
  })
  return form
}

function reportFormError(form: Form, errs: ErrorConst[]) {
  reportNext(form, errs, 0)
}

function reportNext(form: Form, errs: ErrorConst[], i: number) {
  if (i === errs.length)
    return

  const err = errs[i]

  if (err.field === '_system') {
    openErrorModal(err, () => {
      reportNext(form, errs, i + 1)
    })
    return
  }

  const field = form.all[err.field]
  const error = newError(err.message)
  if (field) {
    field.parentElement?.after(error)
  } else {
    form.form.querySelector('.error-group')?.append(error)
  }
  reportNext(form, errs, i + 1)
}

function newError(message: string) {
  const err = document.createElement('div')
  err.classList.add('error')
  err.textContent = message
  return err
}

function clearFormError(form: Form) {
  const list = form.form.querySelectorAll('.error')
  Array.from(list).forEach(el => el.remove())
}

function disableSubmitButton(form: Form) {
  const btn = form.button.send
  if (!btn.disabled) {
    btn.dataset.innerText = btn.innerText
    btn.innerText = '전송중'
    btn.disabled = true
  }
}

function enableSubmitButton(form: Form) {
  const btn = form.button.send
  if (btn.disabled) {
    btn.innerText = btn.dataset.innerText as string
    btn.disabled = false
  }
}
