
export function getElementById(id: string) {
  return document.getElementById(id)
}

export function domQuery(q: string, el:ParentNode = document) {
  return el.querySelector(q)
}

export function domQueryAll(q: string, el:ParentNode = document) {
  return Array.from(el.querySelectorAll(q)) as HTMLElement[]
}

export function newElementFromHtml(html: string) {
  const template = document.createElement('template')
  template.innerHTML = html.trim()
  return template.content.firstElementChild as HTMLElement
}

export function newElementListFromHtml(html: string) {
  const template = document.createElement('template')
  template.innerHTML = html.trim()
  return template.content.children
}

export function getEmbeddedJson(id: string) {
  const el = getElementById(id) as HTMLElement
  return JSON.parse(decodeHtml(el.innerText))
}

function decodeHtml(raw: string) {
  const doc = new DOMParser().parseFromString(raw, 'text/html')
  return doc.documentElement.textContent as string
}
