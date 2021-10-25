import { ErrorConst } from '@common/type/error'

export type ControlMap = {
  [key: string]: HTMLElement
}

export function elementByName(name: string) {
  return document.getElementsByName(name)[0]
}

export function grabForm(name: string) {
  const r: ControlMap = {}
  r.form = document.querySelector(name) as HTMLElement

  const list = document.querySelectorAll(
    `${name} input, ${name} textarea, ${name} select, ${name} button`
  )
  Array.from(list).forEach(el => {
    const name = el.getAttribute('name')
    if (name) {
      r[name] = el as HTMLElement
    }
  })

  return r
}

export function reportFormError(form:ControlMap, errs: ErrorConst[]) {
  for (const err of errs) {
    const ctrlNode = form[err.field]
    const errNode = newErrorNode(err.message)
    if (ctrlNode) {
      ctrlNode.after(errNode)
    } else {
      form.form.prepend(errNode)
    }
  }
}

function newErrorNode(message: string) {
  const err = document.createElement('p')
  err.classList.add('error')
  err.textContent = message
  return err
}

export function clearFormError(form:HTMLElement) {
  const list = form.querySelectorAll('.error')
  Array.from(list).forEach(el => el.remove())
}

export function disableSubmit(el: Element) {
  const btn = el as HTMLButtonElement
  if (!btn.disabled) {
    btn.dataset.innerText = btn.innerText
    btn.innerText = '전송중'
    btn.disabled = true
  }
}

export function enableSubmit(el: Element) {
  const btn = el as HTMLButtonElement
  if (btn.disabled) {
    btn.innerText = btn.dataset.innerText as string
    btn.disabled = false
  }
}
