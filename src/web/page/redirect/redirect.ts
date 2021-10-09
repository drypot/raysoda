import { Express2, toCallback } from '../../_express/express2.js'
import { UserCache } from '../../../db/user/cache/user-cache.js'
import { INVALID_PAGE } from '../../../_type/error.js'

export function registerRedirect(web: Express2, uc: UserCache) {

  web.router.get('/Com/Photo/View.aspx', function (req, res) {
    res.redirect(301, '/image/' + req.query.p)
  })

  web.router.get('/Com/Photo/List.aspx', function (req, res) {
    if (req.query.u) {
      res.redirect(301, '/user/' + req.query.u)
    } else {
      res.redirect(301, '/')
    }
  })

  web.router.get('/Com/Photo/CList.aspx', function (req, res) {
    res.redirect(301, '/')
  })

  web.router.get('/users/:id([0-9]+)', function (req, res) {
    res.redirect(301, '/user/' + req.params.id)
  })

  web.router.get('/images/:id([0-9]+)', function (req, res) {
    res.redirect(301, '/image/' + req.params.id)
  })

  web.router.get('/:name([^/]+)', toCallback(async (req, res) => {
    const user = await uc.getCachedByHome(req.params.name)
    if (user) {
      res.redirect(301, '/user/' + encodeURIComponent(req.params.name))
    } else {
      res.status(404)
      throw INVALID_PAGE
    }
  }))

}
