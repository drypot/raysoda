import { omanGetObject, omanRegisterFactory } from '@server/oman/oman'
import { Image } from '@common/type/image'
import { DB } from '@server/db/_db/db'
import { inProduction } from '@common/util/env2'
import { PageParam } from '@common/type/page'
import { ImagePage } from '@common/type/image-list'

omanRegisterFactory('ImageDB', async () => {
  const idb = ImageDB.from(await omanGetObject('DB') as DB)
  await idb.createTable()
  return idb
})

export class ImageDB {

  private db: DB
  private nextId: number = 0

  static from(db: DB) {
    return new ImageDB(db)
  }

  private constructor(db: DB) {
    this.db = db
  }

  // Table

  async createTable() {
    await this.db.query(
      'create table if not exists image(' +
      '  id int not null,' +
      '  uid int not null,' +
      '  cdate datetime(3) not null,' +
      '  vers varchar(4096) not null default "null",' +
      '  comment text not null,' +
      '  primary key (id)' +
      ')'
    )
    await this.db.createIndexIfNotExists(
      'create index image_cdate on image(cdate desc)'
    )
    await this.db.createIndexIfNotExists(
      'create index image_uid_cdate on image(uid, cdate desc)'
    )
    this.nextId = await this.db.getMaxId('image')
    this.nextId++
    return this
  }

  async dropTable() {
    if (inProduction()) {
      throw (new Error('only available in development mode'))
    }
    await this.db.query('drop table if exists image')
  }

  // Query

  async insertImage(image: Image) {
    const pack = newPack(image)
    return this.db.query('insert into image set ?', pack)
  }

  async updateImage(id: number, image: Partial<Image>) {
    const pack = newPack(image)
    const r = await this.db.query('update image set ? where id = ?', [pack, id])
    return r.changedRows as number
  }

  async deleteImage(id: number) {
    await this.db.query('delete from image where id = ?', id)
  }

  async getImage(id: number) {
    const r = await this.db.queryOne('select * from image where id = ?', id)
    if (r) unpackImage(r)
    return r as Image | undefined
  }

  async getFirstImage() {
    const r = await this.db.queryOne('select * from image order by cdate limit 1')
    if (r) unpackImage(r)
    return r as Image | undefined
  }

  // image list

  async fillImagePage(page: ImagePage, param: PageParam) {
    const list = await this.getImageList(param)
    unpackImageList(list)
    page.rawList = list
    await this.fillPrevNext(page, param)
  }

  private async getImageList(param: PageParam): Promise<Image[]> {
    if (param.uid) {
      return this.getUserImageList(param)
    }
    if(param.date) {
      const img = await this.db.queryOne(
        'select id from image where cdate >= ? order by cdate limit 1',
        param.date
      )
      if (img) {
        const r = await this.db.query(
          'select * from image where id >= ? order by id limit ?',
          [img.id, param.size]
        )
        r.reverse()
        return r
      }
      return []
    }
    if (param.begin) {
      return this.db.query(
        'select * from image where id <= ? order by id desc limit ?',
        [param.begin, param.size]
      )
    }
    if (param.end) {
      const r = await this.db.query(
        'select * from image where id >= ? order by id limit ?',
        [param.end, param.size]
      )
      r.reverse()
      return r
    }
    const offset = param.page ? (param.page - 1) * param.size : 0
    return this.db.query(
      'select * from image order by id desc limit ?, ?',
      [offset, param.size]
    )
  }

  private async getUserImageList(param: PageParam): Promise<Image[]> {
    if(param.date) {
      const img = await this.db.queryOne(
        'select * from image where uid = ? and cdate >= ? order by cdate limit 1',
        [param.uid, param.date]
      )
      if (img) {
        const r = await this.db.query(
          'select * from image where uid = ? and id >= ? order by id limit ?',
          [param.uid, img.id, param.size]
        )
        r.reverse()
        return r
      }
      return []
    }
    if (param.begin) {
      return this.db.query(
        'select * from image where uid = ? and id <= ? order by id desc limit ?',
        [param.uid, param.begin, param.size]
      )
    }
    if (param.end) {
      const r = await this.db.query(
        'select * from image where uid = ? and id >= ? order by id limit ?',
        [param.uid, param.end, param.size]
      )
      r.reverse()
      return r
    }
    const offset = param.page ? (param.page - 1) * param.size : 0
    return this.db.query(
      'select * from image where uid = ? order by id desc limit ?, ?',
      [param.uid, offset, param.size]
    )
  }

  private async fillPrevNext(page: ImagePage, param: PageParam) {
    const list = page.rawList
    let prev: any
    let next: any
    if (list?.length) {
      if (param.uid) {
        prev = await this.db.queryOne(
          'select id from image where uid = ? and id > ? order by id limit 1',
          [param.uid, list[0].id]
        )
        next = await this.db.queryOne(
          'select id from image where uid = ? and id < ? order by id desc limit 1',
          [param.uid, list[list.length - 1].id]
        )
      } else {
        prev = await this.db.queryOne(
          'select id from image where id > ? order by id limit 1',
          [list[0].id]
        )
        next = await this.db.queryOne(
          'select id from image where id < ? order by id desc limit 1',
          [list[list.length - 1].id]
        )
      }
      page.prev = prev?.id ?? null
      page.next = next?.id ?? null
    }
  }

  async getCdateListByUser(uid: number, limit: number) {
    const r = await this.db.query(
      'select id, cdate from image where uid = ? order by cdate desc limit ?',
      [uid, limit]
    )
    return r as { id: number, cdate: Date }[]
  }

  // ID

  setNextId(id: number) {
    this.nextId = id
  }

  getNextId() {
    return this.nextId++
  }

}

function newPack(image: Partial<Image>) {
  const pack: any = {}
  for (let [k, v] of Object.entries(image)) {
    if (k === 'vers') {
      v = JSON.stringify(v)
    }
    pack[k] = v
  }
  return pack
}

function unpackImageList(list: any[]) {
  for (const image of list) {
    unpackImage(image)
  }
}

function unpackImage(image: Image) {
  image.vers = JSON.parse(image.vers as unknown as string)
}
