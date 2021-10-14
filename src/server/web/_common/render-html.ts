import { Response } from 'express'

// 공통 프로퍼티를 추가해야할 수도 있으므로
// express 폴더 안에 두지 않고 어플리케이션 폴더 근처에 둔다.

export function renderHtml(res: Response, template: string, obj?: any) {
    //console.log((res.app as any).cache)
    res.render(template, obj)
}
