import { loadConfig } from '../config/config.js'
import { Express2 } from './express2.js'
import { Router } from 'express'
import { SuperAgentTest } from 'supertest'

let server: Express2
let router: Router
let request: SuperAgentTest

const f1 = 'src/lib/express/fixture/express-upload-f1.txt'
const f2 = 'src/lib/express/fixture/express-upload-f2.txt'

describe('Express2 Multer', () => {

  beforeAll(done => {
    const config = loadConfig('config/test.json')
    Express2.startTest(config, (err, _server, _router, _request) => {
      server = _server
      router = _router
      request = _request
      done()
    })
  })

  beforeAll(() => {
    router.post('/api/test/upload', server.upload.array('files', 12), function (req, res, done) {
      res.json({
        ...req.body,
        files: req.files
      })
    })
  })

  describe('posting application/json', () => {
    it('should work', done => {
      request.post('/api/test/upload').send({ 'p1': 'v1' }).end(function (err, res) {
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
      request.post('/api/test/upload').field('p1', 'v1').field('p2', 'v2').field('p2', 'v3').end(function (err, res) {
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
      request.post('/api/test/upload').field(form).end(function (err, res) {
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
      request.post('/api/test/upload').field('p1', 'v1').attach('files', f1).end(function (err, res) {
        expect(err).toBeFalsy()
        expect(res.body.err).toBeFalsy()
        expect(res.body.p1).toBe('v1')
        //
        // res.body.file sample
        //
        // fieldname: 'files'
        // originalname: 'express-upload-f1.txt'
        // encoding: '7bit'
        // mimetype: 'text/plain'
        // destination: 'upload/test/tmp'
        // filename: 'bfd9da3c1b83d8184472ee35ec3539b5'
        // path: 'upload/test/tmp/bfd9da3c1b83d8184472ee35ec3539b5'
        //
        expect(res.body.files.length).toBe(1)
        expect(res.body.files[0].originalname).toBe('express-upload-f1.txt')
        done()
      })
    })
  })

  describe('post two files', () => {
    it('should work', done => {
      request.post('/api/test/upload').field('p1', 'v1').attach('files', f1).attach('files', f2).end(function (err, res) {
        expect(err).toBeFalsy()
        expect(res.body.err).toBeFalsy()
        expect(res.body.p1).toBe('v1')
        expect(res.body.files.length).toBe(2)
        expect(res.body.files[0].originalname).toBe('express-upload-f1.txt')
        expect(res.body.files[1].originalname).toBe('express-upload-f2.txt')
        done()
      })
    })
  })

  describe('post file with irregular name', () => {
    it('should work', done => {
      request.post('/api/test/upload').attach('files', f1, 'file<>()[]_-=.txt.%$#@!&.txt').end(function (err, res) {
        expect(err).toBeFalsy()
        expect(res.body.err).toBeFalsy()
        done()
      })
    })
  })

})
