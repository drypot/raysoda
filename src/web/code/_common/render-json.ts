import { Response } from 'express'

// 공통 프로퍼티를 추가해야할 수도 있으므로
// express 폴더 안에 두지 않고 어플리케이션 폴더 근처에 둔다.

export function renderJson(res: Response, obj?: any) {
    res.json(obj)
}
