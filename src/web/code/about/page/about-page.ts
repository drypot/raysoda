import { Express2 } from '../../../_express/express2.js'
import { renderHtml } from '../../_common/render-html.js'

export function registerAboutPage(web: Express2) {

  web.router.get('/about', function (req, res) {
    renderHtml(res, 'about/about', { abc: new Date() })
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

