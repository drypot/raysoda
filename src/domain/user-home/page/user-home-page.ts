import { getExpress2, toCallback } from '../../../express/express2.js'
import { getUserDB } from '../../../db/user/user-db.js'
import { getImageDB } from '../../../db/image/image-db.js'
import { getImageFileManager } from '../../../fileman/fileman-loader.js'
import { getConfig } from '../../../oman/oman.js'
import { newLimitedNumber, newNumber } from '../../../common/util/primitive.js'
import { renderHtml, throw404 } from '../../../express/response.js'
import { User } from '../../../common/type/user.js'
import { userGetSessionUser } from '../../user/api/user-auth-api.js'
import { newImagePage } from '../../../common/type/image-list.js'
import { newPageParam } from '../../../common/type/page.js'
import { parseDate } from '../../../common/util/date2.js'
import { fillImagePage } from '../../image/service/image-list.js'
import { UrlMaker } from '../../../common/util/url2.js'
import { userCanUpdateUser } from '../../user/service/user-auth.js'
import { Request, Response } from 'express'

export async function useUserHomePage() {

  const express2 = await getExpress2()
  const udb = await getUserDB()
  const idb = await getImageDB()
  const ifm = await getImageFileManager(getConfig().appNamel)

  express2.router.get('/user-id/:id', toCallback(async (req, res) => {
    const id = newNumber(req.params.id)
    const owner = await udb.getCachedById(id)
    if (!owner) return
    await renderHome(req, res, owner)
  }))

  express2.router.get('/user/:name', toCallback(async (req, res) => {
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
