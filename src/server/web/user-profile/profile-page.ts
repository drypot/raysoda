import { Express2, toCallback } from '../_express/express2'
import { ImageDB } from '../../db/image/image-db'
import { Request, Response } from 'express'
import { User } from '../../_type/user'
import { newLimitedNumber, newNumber } from '../../_util/primitive'
import { imageListByUserService } from '../../service/image/image-list-service'
import { UrlMaker } from '../../_util/url2'
import { getSessionUser } from '../user-auth/api/user-auth-api'
import { renderHtml } from '../_common/render-html'
import { userCanUpdateUser } from '../../service/user-auth/user-auth-service'
import { UserDB } from '../../db/user/user-db'
import { omanGetConfig, omanGetObject } from '../../oman/oman'
import { omanGetImageFileManager } from '../../file/_fileman-loader'

export async function useUserProfilePage() {

  const web = await omanGetObject('Express2') as Express2
  const udb = await omanGetObject('UserDB') as UserDB
  const idb = await omanGetObject('ImageDB') as ImageDB
  const ifm = await omanGetImageFileManager(omanGetConfig().appNamel)

  web.router.get('/user-id/:id([0-9]+)', toCallback(async (req, res) => {
    const id = newNumber(req.params.id)
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

  async function renderProfile(req: Request, res: Response, owner: User) {
    const user = getSessionUser(res)
    const p = newLimitedNumber(req.query.p, 1, 1, NaN)
    const ps = newLimitedNumber(req.query.ps, 16, 1, 128)
    const list = await imageListByUserService(udb, idb, ifm, owner.id, p, ps)
    renderHtml(res, 'user-profile/profile', {
      owner: owner,
      updatable: userCanUpdateUser(user, owner.id),
      imageList: list,
      prev: p > 1 ? UrlMaker.from(req.path).add('p', p - 1, 1).add('ps', ps, 16).toString() : undefined,
      next: list.length === ps ? UrlMaker.from(req.path).add('p', p + 1).add('ps', ps, 16).toString() : undefined,
      path: req.path,
    })
  }

}
