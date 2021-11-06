import { Express2 } from '@server/express/express2'
import supertest, { SuperAgentTest } from 'supertest'
import { existsSync, unlinkSync } from 'fs'
import { omanCloseAllObjects, omanGetObject, omanNewSession } from '@server/oman/oman'
import { deleteUpload, Uploader } from '@server/express/uploader'
import { timeout } from '@common/util/async2'

describe('Express2 Upload', () => {

  let web: Express2
  let uploader: Uploader
  let sat: SuperAgentTest

  beforeAll(async () => {
    omanNewSession('config/raysoda-test.json')
    web = await omanGetObject('Express2') as Express2
    uploader = await omanGetObject('Uploader') as Uploader
    await web.start()
    sat = supertest.agent(web.server)
  })

  afterAll(async () => {
    await omanCloseAllObjects()
  })

  const f1 = 'sample/text1.txt'
  const f2 = 'sample/text2.txt'

  it('setup', () => {
    web.router.post('/api/echo-file',
      uploader.single('file'),
      deleteUpload(async (req, res) => {
        res.json({
          ...req.body,
          file: req.file
        })
      }))
    web.router.post('/api/echo-files',
      uploader.array('files', 12),
      deleteUpload(async (req, res) => {
        res.json({
          ...req.body,
          files: req.files
        })
      }))
    web.router.post('/api/echo-file-after-delete',
      uploader.single('file'),
      deleteUpload(async (req, res) => {
        res.json({
          ...req.body,
          file: req.file
        })
        if (!req.file) throw new Error()
        unlinkSync(req.file.path)
      }))
  })
  it('posting json works', async () => {
    const res = await sat.post('/api/echo-files').send({ 'p1': 'v1' }).expect(200)
    expect(res.body).toEqual({
      p1: 'v1'
    })
  })
  it('posting multipart/form-data works', async () => {
    const res = await sat.post('/api/echo-files').field('p1', 'v1').field('p2', 'v2').field('p2', 'v3')
    expect(res.body).toEqual({
      p1: 'v1',
      p2: ['v2', 'v3'],
      files: []
    })
  })
  it('posting multipart/form-data works 2', async () => {
    const form = { p1: 'v1', p2: 'v2', p3: ['v3', 'v4'] }
    const res = await sat.post('/api/echo-files').field(form)
    expect(res.body).toEqual({
      ...form,
      files: []
    })
  })
  it('posting one file works', async () => {
    const res = await sat.post('/api/echo-file').field('p1', 'v1').attach('file', f1)
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
  it('posting files works', async () => {
    const res = await sat.post('/api/echo-files').field('p1', 'v1').attach('files', f1).attach('files', f2)
    expect(res.body.err).toBeFalsy()
    expect(res.body.p1).toBe('v1')
    expect(res.body.files.length).toBe(2)
    expect(res.body.files[0].originalname).toBe('text1.txt')
    expect(res.body.files[1].originalname).toBe('text2.txt')
    await timeout(100)
    expect(existsSync(res.body.files[0].path)).toBe(false)
    expect(existsSync(res.body.files[1].path)).toBe(false)
  })
  it('posting file with irregular name works', async () => {
    const res = await sat.post('/api/echo-files').attach('files', f1, 'file<>()[]_-=.txt.%$#@!&.txt')
    expect(res.body.err).toBeFalsy()
  })
  it('moving posted file works', async () => {
    const res = await sat.post('/api/echo-file-after-delete').field('p1', 'v1').attach('file', f1)
    expect(res.body.err).toBeFalsy()
    await timeout(100)
    expect(existsSync(res.body.file.path)).toBe(false)
  })

})
