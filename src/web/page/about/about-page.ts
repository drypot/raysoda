import { Express2, renderHtml } from '../../_express/express2.js'

export function registerAboutPage(web: Express2) {

  web.router.get('/about', function (req, res) {
    renderHtml(res, 'about/about')
  })

  web.router.get('/company', function (req, res) {
    renderHtml(res, 'about/company')
  })

  web.router.get('/ad', function (req, res) {
    renderHtml(res, 'about/ad')
  })

  web.router.get('/privacy', function (req, res) {
    renderHtml(res, 'about/privacy')
  })

  web.router.get('/help', function (req, res) {
    renderHtml(res, 'about/help')
  })

}

