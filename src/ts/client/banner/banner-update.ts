import { Form, grabForm, linkSubmitHandler } from '@client/util/form'
import { startPing } from '@client/util/ping'
import { getEmbeddedJson } from '@client/util/dom'
import { sendPut } from '@client/util/fetch'
import { Banner } from '@common/type/banner'

export function initBannerUpdate() {
  const form = grabForm('form')
  fillForm(form)
  linkSubmitHandler(form, submit, result)
  startPing()
}

function fillForm(form: Form) {
  const data = getEmbeddedJson('formJson')
  const bannerList = data.bannerList as Banner[]
  form.textarea.bannerList.value = JSON.stringify(bannerList, null, 2)
}

function submit(form: Form) {
  try {
    const data = {
      bannerList: JSON.parse(form.textarea.bannerList.value)
    }
    return sendPut('/api/banner-update', data)
  } catch(err) {
    return Promise.reject(err)
  }
}

function result(body: any) {
  window.location.href = '/'
}
