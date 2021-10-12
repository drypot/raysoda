import { loadConfigSync } from '../_util/config-loader'
import { Config } from '../_type/config'
import { omanObjectMapping } from './oman-mapping'

export type ObjectMaker = () => Promise<any>
export type ObjectCloser = () => Promise<any>

type Manager = {
  config: Config
  objMap: Map<string, any>
  closeHandlerList: ObjectCloser[]
}

let man: Manager

export function omanNewSessionForTest() {
  return omanNewSession('config/app-test.json')
}

export function omanNewSession(configPath: string) {
  man = {
    config: loadConfigSync(configPath),
    objMap: new Map<string, any>(),
    closeHandlerList: []
  }
  return man.config
}

export function omanGetConfig() {
  return man.config
}

export async function omanGetObject(name: string): Promise<any> {
  let obj = man.objMap.get(name)
  if (!obj) {
    const path = omanObjectMapping[name]
    if (!path) {
      throw new Error('Unknown Object Name')
    }
    const m = await import(path)
    obj = await m.newOmanObject()
    man.objMap.set(name, obj)
  }
  return obj
}

export function omanRegisterCloseHandler(handler: ObjectCloser) {
  man.closeHandlerList.unshift(handler)
}

export async function omanCloseAllObjects() {
  const handlerList = man.closeHandlerList
  // @ts-ignore
  man = undefined
  for (const handler of handlerList) {
    await handler()
  }
}
