import { ObjectMaker, omanRegisterCloseHandler } from '../oman'

export type ObjManFix1 = {
  message: string
}

export const newOmanObject: ObjectMaker = async () => {
  let obj = {
    message: 'created'
  }
  omanRegisterCloseHandler(async () => {
    obj.message = 'destroyed'
  })
  return obj
}
