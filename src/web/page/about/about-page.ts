import { Express2 } from '../../_express/express2.js'

export function registerAboutPage(web: Express2) {

  web.router.get('/about', function (req, res) {
    res.render('about/about')
  })

  web.router.get('/company', function (req, res) {
    res.render('about/company')
  })

  web.router.get('/ad', function (req, res) {
    res.render('about/ad')
  })

  web.router.get('/privacy', function (req, res) {
    res.render('about/privacy')
  })

  web.router.get('/help', function (req, res) {
    res.render('about/help')
  })

}

