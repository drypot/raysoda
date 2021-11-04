import { ErrorConst } from '@common/type/error'
import { openErrorModal } from '@client/util/modal'
import { domQuery, domQueryAll, getElementById } from '@client/util/dom'

export type Form = {
  form: HTMLFormElement,
  all: {
    [key: string]: HTMLElement
  }
  input: {
    [key: string]: HTMLInputElement
  },
  textarea: {
    [key: string]: HTMLTextAreaElement
  }
  select: {
    [key: string]: HTMLSelectElement
  }
  file: {
    [key: string]: HTMLInputElement
  }
  button: {
    [key: string]: HTMLButtonElement
  },
}

export function linkSubmitHandler(
  form: Form,
  callFetch: (form: Form) => Promise<any>,
  handleResult: (body: any) => void
) {
  form.button.send.onclick = (e) => {
    submit()
    e.preventDefault()
  }
  return

  function submit() {
    clearError(form)
    disableSubmitButton(form)
    callFetch(form).then(body => {
      if (body.err) {
        reportError(form, body.err)
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

export function grabForm(id: string) {
  const _form = getElementById(id) as HTMLFormElement
  const form: Form = {
    form: _form,
    all: {},
    input: {},
    textarea: {},
    select: {},
    button: {},
    file: {}
  }
  domQueryAll('input', _form).forEach(el => {
    const name = el.getAttribute('name') as string
    if (el.getAttribute('type') === 'file')
      form.file[name] = el as HTMLInputElement
    else
      form.input[name] = el as HTMLInputElement
    form.all[name] = el
  })
  domQueryAll('textarea', _form).forEach(el => {
    const name = el.getAttribute('name') as string
    form.textarea[name] = el as HTMLTextAreaElement
    form.all[name] = el
  })
  domQueryAll('select', _form).forEach(el => {
    const name = el.getAttribute('name') as string
    form.select[name] = el as HTMLSelectElement
    form.all[name] = el
  })
  domQueryAll('button', _form).forEach(el => {
    const name = el.getAttribute('name') as string
    form.button[name] = el as HTMLButtonElement
    form.all[name] = el
  })
  return form
}

function reportError(form: Form, errs: ErrorConst[]) {
  reportNextError(form, errs, 0)
}

function reportNextError(form: Form, errs: ErrorConst[], i: number) {
  if (i === errs.length)
    return

  const err = errs[i]

  if (err.field === '_system') {
    openErrorModal(err, () => {
      reportNextError(form, errs, i + 1)
    })
    return
  }

  const field = form.all[err.field]
  const error = newError(err.message)
  if (field) {
    field.parentElement?.after(error)
  } else {
    domQuery('.error-group', form.form)?.append(error)
  }
  reportNextError(form, errs, i + 1)
}

function newError(message: string) {
  const err = document.createElement('div')
  err.classList.add('error')
  err.textContent = message
  return err
}

function clearError(form: Form) {
  domQueryAll('.error', form.form).forEach(el => el.remove())
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

export function getInputRadioValue(form: Form, name: string) {
  const el = domQuery(`input[name="${name}"]:checked`, form.form) as HTMLInputElement
  return el.value
}

export function setInputRadioChecked(form: Form, name: string, value: string) {
  const el = domQuery(`input[name="${name}"][value="${value}"]`, form.form) as HTMLInputElement
  el.checked = true
}

