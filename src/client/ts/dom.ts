export type HTMLElementMap = {
  [key: string]: HTMLElement
}

export function elementByName(name: string) {
  return document.getElementsByName(name)[0]
}

export function grabForm(name: string) {
  const r: HTMLElementMap = {}
  r._form = document.querySelector(name) as HTMLElement

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


// formty.clearAlerts = function ($form) {
//   $form.find('.has-error').removeClass('has-error')
//   $form.find('.text-danger').remove()
// }
//
// formty.addAlert = function ($control, msg) {
//   let $group = $control.closest('.form-group')
//   $group.addClass('has-error')
//   $group.append($('<p>').addClass('help-block text-danger').text(msg))
// }
//
// formty.addAlerts = function ($form, errors) {
//   for (let i = 0; i < errors.length; i++) {
//     let error = errors[i]
//     formty.addAlert($form.find('[name="' + error.field + '"]'), error.message)
//   }
// }

export function reportFormError(form:HTMLElementMap, body: any) {
  const errList = body.err

}

export function clearFormError(form:HTMLElementMap) {

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
