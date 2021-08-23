import { Express2, toCallback } from '../lib/express/express2.js'
import { CounterDB } from './counter-db.js'
import { sessionUserFrom } from '../user/case/login/user-login-api.js'
import { NOT_AUTHENTICATED, NOT_AUTHORIZED } from '../user/case/register-form/user-form.js'

export function registerCounterApi(web: Express2, cdb: CounterDB) {

  web.router.get('/api/counter/:id/inc', toCallback(async (req, res) => {
    await cdb.update(req.params.id)
    res.redirect(req.query.r as string)
  }))

  web.router.get('/api/counter/:id', toCallback(async (req, res) => {
    const user = sessionUserFrom(res)
    if (!user) throw NOT_AUTHENTICATED
    if (!user.admin) throw NOT_AUTHORIZED
    const id = req.params.id
    const b = req.query.b as string
    const e = req.query.e as string
    const r = await cdb.findRange(id, b, e)
    res.json({ counter: r })
  }))

}
