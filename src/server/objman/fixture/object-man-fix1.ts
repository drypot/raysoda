import { ObjManObjectMaker, objManRegisterCloseHandler } from '../object-man'

export type ObjManFix1 = {
  message: string
}

export const serviceObjManObject: ObjManObjectMaker = async (forTest) => {
  const obj = {
    message: forTest ?
      'created for test' :
      'created'
  }
  registerCloseHandler(obj)
  return obj
}

function registerCloseHandler(obj: ObjManFix1) {
  objManRegisterCloseHandler(async () => {
    obj.message = 'destroyed'
  })
}
