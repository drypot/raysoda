import { omanRegisterCloser, omanRegisterMaker } from '../oman'

export type ObjManFix1 = {
  message: string
}

omanRegisterMaker('ObjManFix1', async () => {
  let obj = {
    message: 'created'
  }
  omanRegisterCloser(async () => {
    obj.message = 'destroyed'
  })
  return obj
})
