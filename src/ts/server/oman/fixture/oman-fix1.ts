import { registerObjectCloser, registerObjectFactory } from '@server/oman/oman'

export type ObjManFix1 = {
  message: string
}

registerObjectFactory('ObjManFix1', async () => {
  let obj = {
    message: 'created'
  }
  registerObjectCloser(async () => {
    obj.message = 'destroyed'
  })
  return obj
})
