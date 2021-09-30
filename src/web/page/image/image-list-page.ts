import { Express2, toCallback } from '../../_express/express2.js'
import { UserDB } from '../../../db/user/user-db.js'
import { ImageDB } from '../../../db/image/image-db.js'
import { ImageFileManager } from '../../../file/fileman.js'

export function registerImageListPage(web: Express2, udb: UserDB, idb: ImageDB, ifm: ImageFileManager) {

  web.router.get('/', toCallback(async (req, res) => {
    //...
  }))

  web.router.get('/image', toCallback(async (req, res) => {
    //...
  }))

}
