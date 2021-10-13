import { Express2 } from '../../../_express/express2'
import { renderHtml } from '../../_common/render-html'
import { omanGetObject } from '../../../../oman/oman'

export async function useAboutPage() {

  const web = await omanGetObject('Express2') as Express2

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

