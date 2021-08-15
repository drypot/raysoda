import { configFrom } from '../../app/config/config.js'
import { deleteUpload, Express2 } from './express2.js'
import { Router } from 'express'
import { SuperAgentTest } from 'supertest'
import { Multer } from 'multer'
import { assertPathNotExists } from '../base/assert2.js'
import { timeout } from '../base/async2.js'

describe('Express2 Upload', () => {

  const f1 = 'src/lib/express/fixture/express-upload-f1.txt'
  const f2 = 'src/lib/express/fixture/express-upload-f2.txt'

  let web: Express2
  let router: Router
  let request: SuperAgentTest
  let upload: Multer

  beforeAll(async () => {
    const config = configFrom('config/app-test.json')
    web = await Express2.from(config).start()
    router = web.router
    upload = web.upload
    request = web.spawnRequest()
  })

  afterAll(async () => {
    await web.close()
  })

  beforeAll(() => {
    router.post('/api/test/upload-file', upload.single('file'), deleteUpload(async (req, res) => {
      res.json({
        ...req.body,
        file: req.file
      })
    }))
    router.post('/api/test/upload-files', upload.array('files', 12), deleteUpload(async (req, res) => {
      res.json({
        ...req.body,
        files: req.files
      })
    }))
  })

  describe('posting application/json', () => {
    it('should work', async () => {
      const res = await request.post('/api/test/upload-files').send({ 'p1': 'v1' })
      expect(res.body).toEqual({
        p1: 'v1'
      })
    })
  })

  describe('posting multipart/form-data field', () => {
    it('should work', async () => {
      const res = await request.post('/api/test/upload-files').field('p1', 'v1').field('p2', 'v2').field('p2', 'v3')
      expect(res.body).toEqual({
        p1: 'v1',
        p2: ['v2', 'v3'],
        files: []
      })
    })
    it('should work with object field', async () => {
      const form = {
        p1: 'v1',
        p2: 'v2',
        p3: ['v3', 'v4']
      }
      const res = await request.post('/api/test/upload-files').field(form)
      expect(res.body).toEqual({
        ...form,
        files: []
      })
    })
  })

  describe('post one file', () => {
    it('should work', async () => {
      const res = await request.post('/api/test/upload-file').field('p1', 'v1').attach('file', f1)
      expect(res.body.err).toBeFalsy()
      expect(res.body.p1).toBe('v1')
      //
      // res.body.file sample
      //
      // fieldname: 'file'
      // originalname: 'express-upload-f1.txt'
      // encoding: '7bit'
      // mimetype: 'text/plain'
      // destination: 'upload/test/tmp'
      // filename: 'bfd9da3c1b83d8184472ee35ec3539b5'
      // path: 'upload/test/tmp/bfd9da3c1b83d8184472ee35ec3539b5'
      //
      expect(res.body.file.originalname).toBe('express-upload-f1.txt')
      await timeout(100)
      assertPathNotExists(res.body.file.path)
    })
  })

  describe('post two files', () => {
    it('should work', async () => {
      const res = await request.post('/api/test/upload-files').field('p1', 'v1').attach('files', f1).attach('files', f2)
      expect(res.body.err).toBeFalsy()
      expect(res.body.p1).toBe('v1')
      expect(res.body.files.length).toBe(2)
      expect(res.body.files[0].originalname).toBe('express-upload-f1.txt')
      expect(res.body.files[1].originalname).toBe('express-upload-f2.txt')
      await timeout(100)
      assertPathNotExists(res.body.files[0].path)
      assertPathNotExists(res.body.files[1].path)
    })
  })

  describe('post file with irregular name', () => {
    it('should work', async () => {
      const res = await request.post('/api/test/upload-files').attach('files', f1, 'file<>()[]_-=.txt.%$#@!&.txt')
      expect(res.body.err).toBeFalsy()
    })
  })

})
