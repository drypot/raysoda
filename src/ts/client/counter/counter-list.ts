import { Form, grabForm, linkSubmitHandler } from '@client/util/form'
import { getElementById } from '@client/util/dom'
import { sendGet } from '@client/util/fetch'
import { dateToStringNoTime, parseDate } from '@common/util/date2'
import { Counter } from '@common/type/counter'

export function initCounterList() {
  const form = grabForm('form')
  fillForm(form)
  linkSubmitHandler(form, submit, result)
}

function fillForm(form: Form) {
  const begin = new Date()
  begin.setDate(0) // 지난달의 마지날 날로 돌린다.
  begin.setDate(1) // 추가로 지난 달의 첫날로 돌린다.
  const end = new Date()
  end.setDate(0)

  form.input.id.value = 'adng'
  end.setMonth(end.getMonth() + 1) // for test

  form.input.begin.value = dateToStringNoTime(begin)
  form.input.end.value = dateToStringNoTime(end)
}

function submit(form: Form) {
  const id = form.input.id.value
  const begin = form.input.begin.value
  const end = form.input.end.value
  return sendGet(`/api/counter-list/${id}?b=${begin}&e=${end}`)
}

function result(body: any) {
  const list = body.counterList as Counter[]
  let sum = 0
  let html = '<pre class="mx-auto lh-5 text-left max-w-2xs">'
  list.forEach(counter => {
    html += '' + dateToStringNoTime(parseDate(counter.d)) + '\t' + counter.c + '<br>'
    sum += counter.c
  })
  html += '<br>총 ' + sum + ' 회<br>'
  html += '</pre>'
  const el = getElementById('list')
  el.innerHTML = html
}

