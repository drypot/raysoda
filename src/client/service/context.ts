function htmlDecode(raw: string) {
  const doc = new DOMParser().parseFromString(raw, "text/html")
  return doc.documentElement.textContent as string
}

function getEmbededObjectById(id: string) {
  let raw = (document.getElementById(id) as HTMLElement).innerText
  return JSON.parse(htmlDecode(raw))
}

export const config = getEmbededObjectById('configJson')
export const user = getEmbededObjectById('userJson')

export const pathSlice = window.location.pathname.slice(1).split('/')
export const searchParams = new URLSearchParams(window.location.search)

export const $window = $(window)
export const $document = $(document)

