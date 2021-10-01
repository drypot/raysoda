import { Express2, toCallback } from '../../_express/express2.js'
import { ImageDB } from '../../../db/image/image-db.js'
import { ImageFileManager } from '../../../file/fileman.js'
import { Request, Response } from 'express'
import { User } from '../../../_type/user.js'
import { paramToLimitedNumber, paramToNumber } from '../../../_util/param.js'
import { imageListByUserService } from '../../../service/image/image-list-service.js'
import { UrlMaker } from '../../../_util/url2.js'
import { loginUserFrom } from '../../api/user-login/login-api.js'
import { UserCache } from '../../../db/user/user-cache.js'

export function registerUserProfilePage(web: Express2, uc: UserCache, idb: ImageDB, ifm: ImageFileManager) {

  web.router.get('/user-id/:id([0-9]+)', toCallback(async (req, res) => {
    const id = paramToNumber(req.params.id)
    const owner = await uc.getCachedById(id)
    if (!owner) return
    await renderProfile(req, res, owner)
  }))

  web.router.get('/user/:name([^/]+)', toCallback(async (req, res) => {
    const home = decodeURIComponent(req.params.name)
    const owner = await uc.getCachedByHome(home)
    if (!owner) return
    await renderProfile(req, res, owner)
  }))

  async function renderProfile(req: Request, res: Response, owner: User) {
    const user = loginUserFrom(res)
    const p = paramToLimitedNumber(req.query.p as string, 1, 1, NaN)
    const ps = paramToLimitedNumber(req.query.ps as string, 16, 1, 128)
    const hl = await imageListByUserService(uc, idb, ifm, owner.id, p, ps)
    res.render('user-profile/profile', {
      owner: owner,
      updatable: user && (user.id === owner.id || user.admin),
      imageList: hl,
      prev: p > 1 ? UrlMaker.from(req.path).add('p', p - 1, 1).add('ps', ps, 16).toString() : undefined,
      next: hl.length === ps ? UrlMaker.from(req.path).add('p', p + 1).add('ps', ps, 16).toString() : undefined,
      path: req.path,
    })
  }

}
