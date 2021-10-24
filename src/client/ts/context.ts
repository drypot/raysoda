import { ConfigForClient } from '@common/type/config'
import { UserIdCard } from '@common/type/user'

function htmlDecode(raw: string) {
  const doc = new DOMParser().parseFromString(raw, "text/html")
  return doc.documentElement.textContent as string
}

function getEmbeddedObjectById(id: string) {
  let raw = (document.getElementById(id) as HTMLElement).innerText
  return JSON.parse(htmlDecode(raw))
}

export const config = getEmbeddedObjectById('configJson') as ConfigForClient
export const user = getEmbeddedObjectById('userJson') as UserIdCard

// console.log(JSON.stringify(config))
// console.log(JSON.stringify(user))

export function isGuest() {
  return user.id === -1
}

export const pathSlice = window.location.pathname.slice(1).split('/')
export const searchParams = new URLSearchParams(window.location.search)

