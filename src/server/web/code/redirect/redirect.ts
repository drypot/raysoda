import { Express2 } from '../../_express/express2'
import { omanGetObject } from '../../../oman/oman'
import { UserDB } from '../../../db/user/user-db'

export async function useRedirect() {

  const web = await omanGetObject('Express2') as Express2
  const udb = await omanGetObject('UserDB') as UserDB

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

  web.router.get('/:name([^/]+)', (req, res, done) => {
    udb.getCachedByHome(req.params.name).then((user) => {
      if (user) {
        res.redirect(301, '/user/' + encodeURIComponent(req.params.name))
        return
      }
      done()
    }).catch(done)
  })

}
