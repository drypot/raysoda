import { Express2, toCallback } from '../_express/express2.js'
import { UserDB } from '../../db/user/user-db.js'
import { ImageDB } from '../../db/image/image-db.js'
import { ImageFileManager } from '../../file/fileman.js'
import { Request, Response } from 'express'
import { User } from '../../_type/user.js'
import { limitedNumberFrom, numberFrom } from '../../_util/primitive.js'
import { imageListByUserService } from '../../service/image/image-list-service.js'
import { UrlMaker } from '../../_util/url2.js'
import { sessionUserFrom } from '../user-login/login-api.js'

export function registerUserXPage(web: Express2, udb: UserDB, idb: ImageDB, ifm: ImageFileManager) {

  web.router.get('/user-id/:id([0-9]+)', toCallback(async (req, res) => {
    const id = numberFrom(req.params.id)
    const owner = await udb.getCachedById(id)
    if (!owner) return
    await renderProfile(req, res, owner)
  }))

  web.router.get('/user/:name([^/]+)', toCallback(async (req, res) => {
    const home = decodeURIComponent(req.params.name)
    const owner = await udb.getCachedByHome(home)
    if (!owner) return
    await renderProfile(req, res, owner)
  }))

  web.router.get('/:name([^/]+)', toCallback(async (req, res) => {
    // const home = decodeURIComponent(req.params.name)
    // const owner = await udb.getCachedByHome(home)
    // if (!owner) return
    res.redirect(301, '/user/' + req.params.name)
  }))

  async function renderProfile(req: Request, res: Response, owner: User) {
    const user = sessionUserFrom(res)
    const p = limitedNumberFrom(req.query.p as string, 1, 1, NaN)
    const ps = limitedNumberFrom(req.query.ps as string, 16, 1, 128)
    const hl = await imageListByUserService(udb, idb, ifm, owner, p, ps)
    res.render('userx/pug/userx', {
      owner: owner,
      updatable: user && (user.id === owner.id || user.admin),
      imageList: hl,
      prev: p > 1 ? UrlMaker.from(req.path).add('p', p - 1, 1).add('ps', ps, 16).gen() : undefined,
      next: hl.length === ps ? UrlMaker.from(req.path).add('p', p + 1).add('ps', ps, 16).gen() : undefined,
      path: req.path,
    })
  }

}
