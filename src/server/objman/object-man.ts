import { loadConfigSync } from '../_util/config-loader'
import { Config } from '../_type/config'
import { objManObjectMapping } from './object-mapping'

export type ObjMaker = () => Promise<any>
export type ObjCloser = () => Promise<any>

type Manager = {
  config: Config
  objMap: Map<string, any>
  closeHandlerList: ObjCloser[]
}

let man: Manager

export function objManNewSession(configPath: string) {
  man = {
    config: loadConfigSync(configPath),
    objMap: new Map<string, any>(),
    closeHandlerList: []
  }
  return man.config
}

export function objManGetConfig() {
  return man.config
}

export async function objManGetObject(name: string): Promise<any> {
  let obj = man.objMap.get(name)
  if (!obj) {
    const path = objManObjectMapping[name]
    if (!path) {
      throw new Error('Unknown Object Name')
    }
    const m = await import(path)
    obj = await m.serviceObject()
    man.objMap.set(name, obj)
  }
  return obj
}

export function objManRegisterCloseHandler(handler: ObjCloser) {
  man.closeHandlerList.unshift(handler)
}

export async function objManCloseAllObjects() {
  const list = man.closeHandlerList
  // @ts-ignore
  man = undefined
  for (const handler of list) {
    await handler()
  }
}
