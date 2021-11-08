
// 이 펑션에서 null 을 리턴해야할 경우는 없다고 상정한다.
export function getElementById(id: string) {
  return document.getElementById(id) as HTMLElement
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
  try {
    const el = getElementById(id)
    return JSON.parse(decodeHtml(el.innerText))
  } catch(e) {
    return {}
  }
}

function decodeHtml(raw: string) {
  const doc = new DOMParser().parseFromString(raw, 'text/html')
  return doc.documentElement.textContent as string
}
