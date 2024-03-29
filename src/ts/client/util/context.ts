import { ConfigForClient } from '@common/type/config'
import { UserIdCard } from '@common/type/user'
import { getEmbeddedJson } from '@client/util/dom'

export const config = getEmbeddedJson('configJson') as ConfigForClient
export const user = getEmbeddedJson('userJson') as UserIdCard

// console.log(JSON.stringify(config))
// console.log(JSON.stringify(user))

export const pathList = window.location.pathname.slice(1).split('/')
export const searchParams = new URLSearchParams(window.location.search)

export function isGuest() {
  return user.id === -1
}
