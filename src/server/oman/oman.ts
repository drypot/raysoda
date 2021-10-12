import { loadConfigSync } from '../_util/config-loader'
import { Config } from '../_type/config'
import { TEST_CONFIG_PATH } from '../_type/config-path'

export type OmanFactory = () => Promise<any>
export type OmanCloser = () => Promise<any>

type Session = {
  config: Config
  objMap: Map<string, any>
  closerList: OmanCloser[]
}

const debug = false
const factoryMap = new Map<string, OmanFactory>()
let session: Session

export function omanRegisterFactory(name: string, factory: OmanFactory) {
  if (factoryMap.get(name)) {
    throw new Error('Object name already used.')
  }
  if (debug) {
    console.log(`${name} maker registered.`)
  }
  factoryMap.set(name, factory)
}

export function omanNewSessionForTest() {
  return omanNewSession(TEST_CONFIG_PATH)
}

export function omanNewSession(configPath: string) {
  session = {
    config: loadConfigSync(configPath),
    objMap: new Map<string, any>(),
    closerList: []
  }
  return session.config
}

export function omanGetConfig() {
  return session.config
}

export async function omanGetObject(name: string): Promise<any> {
  let obj = session.objMap.get(name)
  if (obj) {
    if (debug) {
      console.debug(`${name} reused.`)
    }
  }
  if (!obj) {
    obj = await newObject(name)
    session.objMap.set(name, obj)
    if (debug) {
      console.debug(`New ${name} object registered.`)
    }
  }
  return obj
}

async function newObject(name: string) {
  const maker = factoryMap.get(name)
  if (!maker) {
    throw new Error('Unknown Object Name')
  }
  return maker()
}

export function omanRegisterCloser(closer: OmanCloser) {
  session.closerList.unshift(closer)
}

export async function omanCloseAllObjects() {
  const closerList = session.closerList
  // @ts-ignore
  session = undefined
  for (const closer of closerList) {
    await closer()
  }
}
