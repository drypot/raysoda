import { ObjMaker, objManRegisterCloseHandler } from '../object-man'

export type ObjManFix1 = {
  message: string
}

export const serviceObject: ObjMaker = async () => {
  let obj = {
    message: 'created'
  }
  objManRegisterCloseHandler(async () => {
    obj.message = 'destroyed'
  })
  return obj
}
