import { loadConfigSync } from '../_util/config-loader'
import { Config } from '../_type/config'
import { objManObjectMapping } from './object-mapping'

export type ObjManObjectMaker = (forTest: boolean) => Promise<any>
export type ObjManCloseHandler = () => Promise<any>

type Manager = {
  config: Config
  objMap: Map<string, any>
  closeHandlerList: ObjManCloseHandler[]
}

let man: Manager

export function objManReset(configPath: string) {
  man = {
    config: loadConfigSync(configPath),
    objMap: new Map<string, any>(),
    closeHandlerList: []
  }
  return man.config
}

export async function objManGetObject(name: string, forTest: boolean = false): Promise<any> {
  let obj = man.objMap.get(name)
  if (!obj) {
    const m = await import(objManObjectMapping[name])
    obj = await m.serviceObjManObject(forTest)
    man.objMap.set(name, obj)
  }
  return obj
}

export function objManRegisterCloseHandler(handler: ObjManCloseHandler) {
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
