import { loadConfig } from '../../app/config/config.js'
import { deleteUpload, Express2 } from './express2.js'
import { Router } from 'express'
import { SuperAgentTest } from 'supertest'
import { Multer } from 'multer'
import { assertPathNotExists } from '../base/assert2.js'

describe('Express2 Upload', () => {

  const f1 = 'src/lib/express/fixture/express-upload-f1.txt'
  const f2 = 'src/lib/express/fixture/express-upload-f2.txt'

  let server: Express2
  let router: Router
  let request: SuperAgentTest
  let upload: Multer

  beforeAll(done => {
    const config = loadConfig('config/app-test.json')
    server = new Express2(config)
    router = server.router
    upload = server.upload
    request = server.spawnRequest()
    server.start(done)
  })

  afterAll(done => {
    server.close(done)
  })

  beforeAll(() => {
    router.post('/api/test/upload-file', upload.single('file'), deleteUpload((req, res, done) => {
      res.json({
        ...req.body,
        file: req.file
      })
      done()  // 업로드된 파일을 삭제하기 위해 done()을 꼭 실행해야 한다
    }))
    router.post('/api/test/upload-files', upload.array('files', 12), deleteUpload((req, res, done) => {
      res.json({
        ...req.body,
        files: req.files
      })
      done()
    }))
  })

  describe('posting application/json', () => {
    it('should work', done => {
      request.post('/api/test/upload-files').send({ 'p1': 'v1' }).end(function (err, res) {
        expect(err).toBeFalsy()
        expect(res.body).toEqual({
          p1: 'v1'
        })
        done()
      })
    })
  })

  describe('posting multipart/form-data field', () => {
    it('should work', done => {
      request.post('/api/test/upload-files').field('p1', 'v1').field('p2', 'v2').field('p2', 'v3').end(function (err, res) {
        expect(err).toBeFalsy()
        expect(res.body).toEqual({
          p1: 'v1',
          p2: ['v2', 'v3'],
          files: []
        })
        done()
      })
    })
    it('should work with object field', done => {
      const form = {
        p1: 'v1',
        p2: 'v2',
        p3: ['v3', 'v4']
      }
      request.post('/api/test/upload-files').field(form).end(function (err, res) {
        expect(err).toBeFalsy()
        expect(res.body).toEqual({
          ...form,
          files: []
        })
        done()
      })
    })
  })

  describe('post one file', () => {
    it('should work', done => {
      request.post('/api/test/upload-file').field('p1', 'v1').attach('file', f1).end(function (err, res) {
        expect(err).toBeFalsy()
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
        setTimeout(() => {
          assertPathNotExists(res.body.file.path)
          done()
        }, 100)
      })
    })
  })

  describe('post two files', () => {
    it('should work', done => {
      request.post('/api/test/upload-files').field('p1', 'v1').attach('files', f1).attach('files', f2).end(function (err, res) {
        expect(err).toBeFalsy()
        expect(res.body.err).toBeFalsy()
        expect(res.body.p1).toBe('v1')
        expect(res.body.files.length).toBe(2)
        expect(res.body.files[0].originalname).toBe('express-upload-f1.txt')
        expect(res.body.files[1].originalname).toBe('express-upload-f2.txt')
        setTimeout(() => {
          assertPathNotExists(res.body.files[0].path)
          assertPathNotExists(res.body.files[1].path)
          done()
        }, 100)
      })
    })
  })

  describe('post file with irregular name', () => {
    it('should work', done => {
      request.post('/api/test/upload-files').attach('files', f1, 'file<>()[]_-=.txt.%$#@!&.txt').end(function (err, res) {
        expect(err).toBeFalsy()
        expect(res.body.err).toBeFalsy()
        done()
      })
    })
  })

})
