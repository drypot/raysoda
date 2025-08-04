import type { Banner } from "../../src/common/type/banner.ts"
import { getEmbeddedJson } from "../util/dom.ts"
import { sendPut } from "../util/fetch.ts"
import { grabForm, linkSubmitHandler, type Form } from "../util/form.ts"
import { startPing } from "../util/ping.ts"

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
