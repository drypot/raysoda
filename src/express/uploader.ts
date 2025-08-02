import newMulter, { Multer } from 'multer'
import { emptyDirSync, mkdirRecursiveSync } from '../common/util/fs2.js'
import { ExpressCallbackHandler, ExpressPromiseHandler } from './express2.js'
import { unlink } from 'fs'
import { getConfig, getObject, registerObjectFactory } from '../oman/oman.js'

export type Uploader = Multer

registerObjectFactory('Uploader', async() => {
  const config = getConfig()
  if (!config.uploadDir) {
    throw new Error('config.uploadDir should be defined')
  }
  const tmpDir = config.uploadDir + '/tmp'
  mkdirRecursiveSync(tmpDir)
  emptyDirSync(tmpDir)
  return newMulter({ dest: tmpDir })
})

export async function getUploader() {
  return await getObject('Uploader') as Uploader
}

export function deleteUpload(handler: ExpressPromiseHandler): ExpressCallbackHandler {
  return (req, res, done) => {
    handler(req, res).catch(done).finally(() => {
      if (req.file) {
        unlink(req.file.path, noop)
      }
      if (req.files) {
        for (const file of req.files as Express.Multer.File[]) {
          unlink(file.path, noop)
        }
      }
    })
  }
}

function noop() {}










