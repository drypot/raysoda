import { loadConfigSync } from '../../_util/config-loader.js'
import { deleteUpload, Express2 } from './express2.js'
import supertest, { SuperAgentTest } from 'supertest'
import { Multer } from 'multer'
import { timeout } from '../../_util/async2.js'
import { existsSync } from 'fs'
import { renderJson } from '../api/_api/api.js'

describe('Express2 Upload', () => {

  let web: Express2
  let sat: SuperAgentTest
  let upload: Multer

  beforeAll(async () => {
    const config = loadConfigSync('config/app-test.json')
    web = Express2.from(config).useUpload()
    await web.start()
    upload = web.upload
    sat = supertest.agent(web.server)
  })

  afterAll(async () => {
    await web.close()
  })

  const f1 = 'sample/text1.txt'
  const f2 = 'sample/text2.txt'

  it('setup', () => {
    web.router.post('/api/upload-file', upload.single('file'), deleteUpload(async (req, res) => {
      renderJson(res, {
        ...req.body,
        file: req.file
      })
    }))
    web.router.post('/api/upload-files', upload.array('files', 12), deleteUpload(async (req, res) => {
      renderJson(res, {
        ...req.body,
        files: req.files
      })
    }))
  })
  it('ok posting application/json', async () => {
    const res = await sat.post('/api/upload-files').send({ 'p1': 'v1' }).expect(200)
    expect(res.body).toEqual({
      p1: 'v1'
    })
  })
  it('ok posting multipart/form-data', async () => {
    const res = await sat.post('/api/upload-files').field('p1', 'v1').field('p2', 'v2').field('p2', 'v3')
    expect(res.body).toEqual({
      p1: 'v1',
      p2: ['v2', 'v3'],
      files: []
    })
  })
  it('ok posting multipart/form-data 2', async () => {
    const form = { p1: 'v1', p2: 'v2', p3: ['v3', 'v4'] }
    const res = await sat.post('/api/upload-files').field(form)
    expect(res.body).toEqual({
      ...form,
      files: []
    })
  })
  it('ok posting one file', async () => {
    const res = await sat.post('/api/upload-file').field('p1', 'v1').attach('file', f1)
    expect(res.body.err).toBeFalsy()
    expect(res.body.p1).toBe('v1')
    //
    // res.body.file sample
    //
    // fieldname: 'file'
    // originalname: 'text1.txt'
    // encoding: '7bit'
    // mimetype: 'text/plain'
    // destination: 'upload/tmp'
    // filename: 'bfd9da3c1b83d8184472ee35ec3539b5'
    // path: 'upload/tmp/bfd9da3c1b83d8184472ee35ec3539b5'
    //
    expect(res.body.file.originalname).toBe('text1.txt')
    await timeout(100)
    expect(existsSync(res.body.file.path)).toBe(false)
  })
  it('ok posting two files', async () => {
    const res = await sat.post('/api/upload-files').field('p1', 'v1').attach('files', f1).attach('files', f2)
    expect(res.body.err).toBeFalsy()
    expect(res.body.p1).toBe('v1')
    expect(res.body.files.length).toBe(2)
    expect(res.body.files[0].originalname).toBe('text1.txt')
    expect(res.body.files[1].originalname).toBe('text2.txt')
    await timeout(100)
    expect(existsSync(res.body.files[0].path)).toBe(false)
    expect(existsSync(res.body.files[1].path)).toBe(false)
  })
  it('ok posting file with irregular name', async () => {
    const res = await sat.post('/api/upload-files').attach('files', f1, 'file<>()[]_-=.txt.%$#@!&.txt')
    expect(res.body.err).toBeFalsy()
  })

})
