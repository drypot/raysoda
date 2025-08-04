import type { ConfigForClient } from "../../src/common/type/config.ts"
import type { UserIdCard } from "../../src/common/type/user.ts"
import { getEmbeddedJson } from "./dom.ts"

// import type { ConfigForClient } from "../common/type/config.ts"
// import type { UserIdCard } from "../common/type/user.ts"
// import { getEmbeddedJson } from "./dom.ts"

export const config = getEmbeddedJson('configJson') as ConfigForClient
export const user = getEmbeddedJson('userJson') as UserIdCard

// console.log(JSON.stringify(config))
// console.log(JSON.stringify(user))

export const pathList = window.location.pathname.slice(1).split('/')
export const searchParams = new URLSearchParams(window.location.search)

export function isGuest() {
  return user.id === -1
}
