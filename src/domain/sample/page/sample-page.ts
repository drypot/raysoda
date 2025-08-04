import { getExpress2 } from '../../../express/express2.ts'
import { renderHtml } from '../../../express/response.ts'

export async function useSamplePage() {

  const express2 = await getExpress2()

  express2.router.get('/sample-en', function (req, res) {
    renderHtml(res, 'sample/sample-en')
  })

  express2.router.get('/sample-kr', function (req, res) {
    renderHtml(res, 'sample/sample-kr')
  })

  express2.router.get('/sample-modal', function (req, res) {
    renderHtml(res, 'sample/sample-modal')
  })

  express2.router.get('/sample-margin', function (req, res) {
    renderHtml(res, 'sample/sample-margin')
  })

}

