import { omanRegisterCloser, omanRegisterFactory } from '../oman'

export type ObjManFix1 = {
  message: string
}

omanRegisterFactory('ObjManFix1', async () => {
  let obj = {
    message: 'created'
  }
  omanRegisterCloser(async () => {
    obj.message = 'destroyed'
  })
  return obj
})
