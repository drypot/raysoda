import { Express2 } from '../lib/express/express2.js'

export function registerRedirectView(web: Express2) {

  const router = web.router

  router.get('/Com/Photo/View.aspx', function (req, res) {
    res.redirect(301, '/image/' + req.query.p)
  })

  router.get('/Com/Photo/List.aspx', function (req, res) {
    if (req.query.u) {
      res.redirect(301, '/user/' + req.query.u)
    } else {
      res.redirect(301, '/')
    }
  })

  router.get('/Com/Photo/CList.aspx', function (req, res) {
    res.redirect(301, '/')
  })

  router.get('/users/:id([0-9]+)', function (req, res) {
    res.redirect(301, '/user/' + req.params.id)
  })

}
