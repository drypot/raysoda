import { loadConfigSync } from '../_util/config-loader'
import { Config } from '../_type/config'
import { objManObjectMapping } from './object-mapping'

export type ObjManObjectMaker = (forTest: boolean) => Promise<any>
export type ObjManCloseHandler = () => Promise<any>

let config: Config
let objMap: Map<string, any>
let closeHandlerList: ObjManCloseHandler[]

export function objManReset(configPath: string) {
  config = loadConfigSync(configPath)
  objMap = new Map<string, any>()
  closeHandlerList = []
  return config
}

export async function objManGetObject(name: string, forTest: boolean = false): Promise<any> {
  let obj = objMap.get(name)
  if (!obj) {
    const m = await import(objManObjectMapping[name])
    obj = await m.serviceObjManObject(forTest)
    objMap.set(name, obj)
  }
  return obj
}

export function objManRegisterCloseHandler(handler: ObjManCloseHandler) {
  closeHandlerList.unshift(handler)
}

export async function objManCloseAllObjects() {
  for (const handler of closeHandlerList) {
    await handler()
  }
}
