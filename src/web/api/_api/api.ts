import { Response } from 'express'

export function renderJson(res: Response, obj?: any) {
    res.json(obj)
}
