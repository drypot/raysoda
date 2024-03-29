import { Express2 } from '@server/express/express2'
import { renderHtml } from '@server/express/response'
import { getObject } from '@server/oman/oman'

export async function useSamplePage() {

  const web = await getObject('Express2') as Express2

  web.router.get('/sample-en', function (req, res) {
    renderHtml(res, '_sample/sample-en')
  })

  web.router.get('/sample-kr', function (req, res) {
    renderHtml(res, '_sample/sample-kr')
  })

  web.router.get('/sample-modal', function (req, res) {
    renderHtml(res, '_sample/sample-modal')
  })

  web.router.get('/sample-margin', function (req, res) {
    renderHtml(res, '_sample/sample-margin')
  })

}

