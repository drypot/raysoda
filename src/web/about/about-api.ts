import { Express2 } from '../_express/express2.js'

export function initAboutView(server: Express2) {

  const router = server.router

  router.get('/about/site', function (req, res) {
    res.render('about/pug/about-site')
  })

  router.get('/about/company', function (req, res) {
    res.render('about/pug/about-company')
  })

  router.get('/about/ad', function (req, res) {
    res.render('about/pug/about-ad')
  })

  router.get('/about/privacy', function (req, res) {
    res.render('about/pug/about-privacy')
  })

  router.get('/about/help', function (req, res) {
    res.render('about/pug/about-help')
  })

}

