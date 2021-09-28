import { Express2 } from '../_express/express2.js'

export function registerAboutApi(server: Express2) {

  const router = server.router

  router.get('/about', function (req, res) {
    res.render('about/pug/about')
  })

  router.get('/company', function (req, res) {
    res.render('about/pug/company')
  })

  router.get('/ad', function (req, res) {
    res.render('about/pug/ad')
  })

  router.get('/privacy', function (req, res) {
    res.render('about/pug/privacy')
  })

  router.get('/help', function (req, res) {
    res.render('about/pug/help')
  })

}

