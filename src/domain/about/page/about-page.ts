import { getExpress2 } from '../../../express/express2.ts'
import { renderHtml } from '../../../express/response.ts'

export async function useAboutPage() {

  const express2 = await getExpress2()

  express2.router.get('/about', function (req, res) {
    renderHtml(res, 'about/about', { abc: new Date() })
  })

  express2.router.get('/company', function (req, res) {
    renderHtml(res, 'about/company')
  })

  express2.router.get('/ad', function (req, res) {
    renderHtml(res, 'about/ad')
  })

  express2.router.get('/privacy', function (req, res) {
    renderHtml(res, 'about/privacy')
  })

  express2.router.get('/help', function (req, res) {
    renderHtml(res, 'about/help')
  })

}

