import { Express2 } from '../../lib/express/express2.js'

export function initAbout(server: Express2) {

  const router = server.router

  router.get('/about/site', function (req, res, done) {
    res.render('app/about/view/about-site')
  })

  router.get('/about/company', function (req, res, done) {
    res.render('app/about/view/about-company')
  })

  router.get('/about/ad', function (req, res, done) {
    res.render('app/about/view/about-ad')
  })

  router.get('/about/privacy', function (req, res, done) {
    res.render('app/about/view/about-privacy')
  })

  router.get('/about/help', function (req, res, done) {
    res.render('app/about/view/about-help')
  })

}

