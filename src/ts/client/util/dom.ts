export function elementById(id: string) {
  return document.getElementById(id) as HTMLElement
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
