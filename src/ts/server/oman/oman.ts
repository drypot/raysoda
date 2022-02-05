import { loadConfigSync } from '@common/util/config-loader'
import { Config } from '@common/type/config'

export type ObjectFactory = () => Promise<any>
export type ObjectCloser = () => Promise<any>

type ObjectContext = {
  config: Config
  objMap: Map<string, any>
  closerList: ObjectCloser[]
}

const debug = false
const factoryMap = new Map<string, ObjectFactory>()
let context: ObjectContext

export function registerObjectFactory(name: string, factory: ObjectFactory) {
  if (factoryMap.get(name)) {
    throw new Error('Object name already used.')
  }
  if (debug) {
    console.log(`${name} maker registered.`)
  }
  factoryMap.set(name, factory)
}

export function initObjectContext(configPath: string) {
  context = {
    config: loadConfigSync(configPath),
    objMap: new Map<string, any>(),
    closerList: []
  }
}

export function getConfig() {
  return context.config
}

export async function getObject(name: string): Promise<any> {
  let obj = context.objMap.get(name)
  if (obj) {
    if (debug) {
      console.debug(`${name} reused.`)
    }
  }
  if (!obj) {
    obj = await newObject(name)
    context.objMap.set(name, obj)
    if (debug) {
      console.debug(`New ${name} object registered.`)
    }
  }
  return obj
}

async function newObject(name: string) {
  const maker = factoryMap.get(name)
  if (!maker) {
    throw new Error('Unknown Object Name ' + name)
  }
  return maker()
}

export function registerObjectCloser(closer: ObjectCloser) {
  context.closerList.unshift(closer)
}

export async function closeAllObjects() {
  const closerList = context.closerList
  // @ts-ignore
  context = undefined
  for (const closer of closerList) {
    await closer()
  }
}
