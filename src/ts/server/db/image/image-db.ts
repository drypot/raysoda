import { omanGetObject, omanRegisterFactory } from '@server/oman/oman'
import { Image } from '@common/type/image'
import { DB } from '@server/db/_db/db'
import { inProduction } from '@common/util/env2'
import { PageParam } from '@common/type/page'
import { ImagePage, newImagePage } from '@common/type/image-detail'

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

  async findImage(id: number) {
    const r = await this.db.queryOne('select * from image where id = ?', id)
    if (r) unpack(r)
    return r as Image | undefined
  }

  async findFirstImage() {
    const r = await this.db.queryOne('select * from image order by cdate limit 1')
    if (r) unpack(r)
    return r as Image | undefined
  }

  // image list

  async getImagePage(p: PageParam) {
    const page = newImagePage()
    if (p.uid) {
      page.list = await this.getImageListUser(p)
    } else {
      page.list = await this.getImageListPublic(p)
    }
    unpackList(page.list as Image[])
    await this.fillImagePagePrevNext(page, p)
    return page
  }

  private async getImageListPublic(p: PageParam): Promise<Image[]> {
    if(p.date) {
      const img = await this.db.queryOne(
        'select id from image where cdate >= ? order by cdate limit 1',
        p.date
      )
      if (img) {
        const r = await this.db.query(
          'select * from image where id >= ? order by id limit ?',
          [img.id, p.size]
        )
        r.reverse()
        return r
      }
      return []
    }
    if (p.begin) {
      return this.db.query(
        'select * from image where id <= ? order by id desc limit ?',
        [p.begin, p.size]
      )
    }
    if (p.end) {
      const r = await this.db.query(
        'select * from image where id >= ? order by id limit ?',
        [p.end, p.size]
      )
      r.reverse()
      return r
    }
    const offset = p.page ? (p.page - 1) * p.size : 0
    return this.db.query(
      'select * from image order by id desc limit ?, ?',
      [offset, p.size]
    )
  }

  private async getImageListUser(p: PageParam): Promise<Image[]> {
    if(p.date) {
      const img = await this.db.queryOne(
        'select * from image where uid = ? and cdate >= ? order by cdate limit 1',
        [p.uid, p.date]
      )
      if (img) {
        const r = await this.db.query(
          'select * from image where uid = ? and id >= ? order by id limit ?',
          [p.uid, img.id, p.size]
        )
        r.reverse()
        return r
      }
      return []
    }
    if (p.begin) {
      return this.db.query(
        'select * from image where uid = ? and id <= ? order by id desc limit ?',
        [p.uid, p.begin, p.size]
      )
    }
    if (p.end) {
      const r = await this.db.query(
        'select * from image where uid = ? and id >= ? order by id limit ?',
        [p.uid, p.end, p.size]
      )
      r.reverse()
      return r
    }
    const offset = p.page ? (p.page - 1) * p.size : 0
    return this.db.query(
      'select * from image where uid = ? order by id desc limit ?, ?',
      [p.uid, offset, p.size]
    )
  }

  private async fillImagePagePrevNext(page: ImagePage, p: PageParam) {
    const list = page.list
    let prev: any
    let next: any
    if (list?.length) {
      if (p.uid) {
        prev = await this.db.queryOne(
          'select id from image where uid = ? and id > ? order by id limit 1',
          [p.uid, list[0].id]
        )
        next = await this.db.queryOne(
          'select id from image where uid = ? and id < ? order by id desc limit 1',
          [p.uid, list[list.length - 1].id]
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

function unpackList(list: any[]) {
  for (const image of list) {
    unpack(image)
  }
}

function unpack(image: Image) {
  image.vers = JSON.parse(image.vers as unknown as string)
}
