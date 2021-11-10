import { Request, Response } from 'express'
import { newErrorConst } from '@common/util/error2'

// 공통 프로퍼티를 추가해야할 수도 있으므로
// express 폴더 안에 두지 않고 어플리케이션 폴더 근처에 둔다.

export function renderHtml(res: Response, template: string, obj?: any) {
    //console.log((res.app as any).cache)
    res.render(template, obj)
}

export function renderJson(res: Response, obj?: any) {
  res.json(obj)
}

export function response404(req: Request, res: Response) {
  res.status(404)
  const err = newErrorConst('INVALID_PAGE', req.path)
  res.json([err])
}
