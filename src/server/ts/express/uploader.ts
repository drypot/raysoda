import newMulter, { Multer } from 'multer'
import { emptyDirSync, mkdirRecursiveSync } from '@common/util/fs2'
import { ExpressCallbackHandler, ExpressPromiseHandler } from '@server/express/express2'
import { unlinkSync } from 'fs'
import { omanGetConfig, omanRegisterFactory } from '@server/oman/oman'

export type Uploader = Multer

omanRegisterFactory('Uploader', async() => {
  const config = omanGetConfig()
  if (!config.uploadDir) {
    throw new Error('config.uploadDir should be defined')
  }
  const tmpDir = config.uploadDir + '/tmp'
  mkdirRecursiveSync(tmpDir)
  emptyDirSync(tmpDir)
  return newMulter({ dest: tmpDir })
})

export function deleteUpload(handler: ExpressPromiseHandler): ExpressCallbackHandler {
  return (req, res, done) => {
    handler(req, res).catch(done).finally(() => {
      if (req.file) {
        unlinkSync(req.file.path)
      }
      if (req.files) {
        for (const file of req.files as Express.Multer.File[]) {
          unlinkSync(file.path)
        }
      }
    })
  }
}
