import { Express2 } from '../../_express/express2.js'

export function initAboutView(server: Express2) {

  const router = server.router

  router.get('/about/site', function (req, res) {
    res.render('about/about-site-view')
  })

  router.get('/about/company', function (req, res) {
    res.render('about/about-company-view')
  })

  router.get('/about/ad', function (req, res) {
    res.render('about/about-ad-view')
  })

  router.get('/about/privacy', function (req, res) {
    res.render('about/about-privacy-view')
  })

  router.get('/about/help', function (req, res) {
    res.render('about/about-help-view')
  })

}

