import { loadConfigSync } from '../_util/config-loader'
import { Config } from '../_type/config'
import { TEST_CONFIG_PATH } from '../_type/config-path'

export type ObjectMaker = () => Promise<any>
export type ObjectCloser = () => Promise<any>

type Session = {
  config: Config
  objMap: Map<string, any>
  closerList: ObjectCloser[]
}

const debug = true
const makerMap = new Map<string, ObjectMaker>()
let session: Session

export function omanRegisterMaker(objName: string, maker: ObjectMaker) {
  if (makerMap.get(objName)) {
    throw new Error('Object name already used.')
  }
  if (debug) {
    console.log(`${objName} maker registered.`)
  }
  makerMap.set(objName, maker)
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
  const maker = makerMap.get(name)
  if (!maker) {
    throw new Error('Unknown Object Name')
  }
  return maker()
}


export function omanRegisterCloser(closer: ObjectCloser) {
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
