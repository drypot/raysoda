import { Express2 } from '../../_express/express2.js'

export function registerAboutPage(server: Express2) {

  const router = server.router

  router.get('/about', function (req, res) {
    res.render('about/about')
  })

  router.get('/company', function (req, res) {
    res.render('about/company')
  })

  router.get('/ad', function (req, res) {
    res.render('about/ad')
  })

  router.get('/privacy', function (req, res) {
    res.render('about/privacy')
  })

  router.get('/help', function (req, res) {
    res.render('about/help')
  })

}

