import { omanGetConfig, omanGetObject } from '@server/oman/oman'
import { User } from '@common/type/user'
import { renderHtml } from '@server/express/render-html'
import { newLimitedNumber, newNumber } from '@common/util/primitive'
import { Express2, toCallback } from '@server/express/express2'
import { userCanUpdateUser } from '@server/domain/user/_service/user-auth-service'
import { getSessionUser } from '@server/domain/user/api/user-auth-api'
import { omanGetImageFileManager } from '@server/file/_fileman-loader'
import { UrlMaker } from '@common/util/url2'
import { ImageDB } from '@server/db/image/image-db'
import { UserDB } from '@server/db/user/user-db'
import { imageListByUserService } from '@server/domain/image/_service/image-list-service'
import { Request, Response } from 'express'

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
