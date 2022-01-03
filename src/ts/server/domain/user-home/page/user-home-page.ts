import { omanGetConfig, omanGetObject } from '@server/oman/oman'
import { User } from '@common/type/user'
import { renderHtml, throw404 } from '@server/express/response'
import { newLimitedNumber, newNumber } from '@common/util/primitive'
import { Express2, toCallback } from '@server/express/express2'
import { userCanUpdateUser } from '@server/domain/user/_service/user-auth'
import { userGetSessionUser } from '@server/domain/user/api/user-auth-api'
import { omanGetImageFileManager } from '@server/fileman/_fileman-loader'
import { UrlMaker } from '@common/util/url2'
import { ImageDB } from '@server/db/image/image-db'
import { UserDB } from '@server/db/user/user-db'
import { fillImagePage } from '@server/domain/image/_service/image-list'
import { Request, Response } from 'express'
import { newImagePage } from '@common/type/image-list'
import { newPageParam } from '@common/type/page'
import { parseDate } from '@common/util/date2'

export async function useUserHomePage() {

  const web = await omanGetObject('Express2') as Express2
  const udb = await omanGetObject('UserDB') as UserDB
  const idb = await omanGetObject('ImageDB') as ImageDB
  const ifm = await omanGetImageFileManager(omanGetConfig().appNamel)

  web.router.get('/user-id/:id([0-9]+)', toCallback(async (req, res) => {
    const id = newNumber(req.params.id)
    const owner = await udb.getCachedById(id)
    if (!owner) return
    await renderHome(req, res, owner)
  }))

  web.router.get('/user/:name([^/]+)', toCallback(async (req, res) => {
    const home = decodeURIComponent(req.params.name)
    const owner = await udb.getCachedByHome(home)
    if (!owner) {
      throw404(req, res)
      return
    }
    await renderHome(req, res, owner)
  }))

  async function renderHome(req: Request, res: Response, owner: User) {
    const user = userGetSessionUser(res)

    const page = newImagePage()
    const param = newPageParam()
    param.uid = owner.id
    param.begin = newLimitedNumber(req.query.pb, 0, 0, NaN)
    param.end = newLimitedNumber(req.query.pe, 0, 0, NaN)
    param.size = newLimitedNumber(req.query.ps, 16, 1, 128)
    param.date = parseDate(req.query.d)
    await fillImagePage(udb, idb, ifm, page, param)

    let prevUrl = ''
    let nextUrl = ''
    if (page.prev) {
      const m = UrlMaker.from(req.path)
      m.add('pe', page.prev, null)
      m.add('ps', param.size, 16)
      prevUrl = m.toString()
    }
    if (page.next) {
      const m = UrlMaker.from(req.path)
      m.add('pb', page.next, null)
      m.add('ps', param.size, 16)
      nextUrl = m.toString()
    }

    renderHtml(res, 'user-home/user-home', {
      owner: owner,
      updatable: userCanUpdateUser(user, owner.id),
      list: page.list,
      prev: prevUrl,
      next: nextUrl,
      path: req.path,
    })
  }

}
