import { getExpress2 } from '../../express/express2.ts'
import { getUserDB } from '../../db/user/user-db.ts'

export async function useRedirect() {

  const express2 = await getExpress2()
  const udb = await getUserDB()

  express2.router.get('/Com/Photo/View.aspx', function (req, res) {
    res.redirect(301, '/image/' + req.query.p)
  })

  express2.router.get('/Com/Photo/List.aspx', function (req, res) {
    if (req.query.u) {
      res.redirect(301, '/user/' + req.query.u)
    } else {
      res.redirect(301, '/')
    }
  })

  express2.router.get('/Com/Photo/CList.aspx', function (req, res) {
    res.redirect(301, '/')
  })

  express2.router.get('/users/:id', function (req, res) {
    res.redirect(301, '/user-id/' + req.params.id)
  })

  express2.router.get('/images/:id', function (req, res) {
    res.redirect(301, '/image/' + req.params.id)
  })

  express2.router.get('/:name', (req, res, done) => {
    udb.getCachedByHome(req.params.name).then((user) => {
      if (user) {
        res.redirect(301, '/user/' + encodeURIComponent(req.params.name))
        return
      }
      done()
    }).catch(done)
  })

}
