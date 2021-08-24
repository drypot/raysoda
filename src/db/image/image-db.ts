import { Config } from '../../config/config.js'
import { DB } from '../_db/db.js'
import { Image } from '../../entity/image-entity.js'

export class ImageDB {

  public config: Config
  private db: DB
  private nextImageId: number = 0

  private constructor(db: DB) {
    this.config = db.config
    this.db = db
  }

  static from(db: DB) {
    return new ImageDB(db)
  }

  // Table

  async createTable(createIndex: boolean = true) {
    const q =
      'create table if not exists image(' +
      '  id int not null,' +
      '  uid int not null,' +
      '  cdate datetime(3) not null,' +
      '  vers varchar(4096) not null default "null",' +
      '  comment text not null,' +
      '  primary key (id)' +
      ')'
    await this.db.query(q)
    if (createIndex) {
      await this.db.createIndexIfNotExists(
        'create index image_cdate on image(cdate desc)'
      )
      await this.db.createIndexIfNotExists(
        'create index image_uid_cdate on image(uid, cdate desc)'
      )
    }
    this.nextImageId = await this.db.getMaxId('image')
    this.nextImageId++
    return this
  }

  async dropTable() {
    if (!this.config.dev) {
      throw (new Error('only available in development mode'))
    }
    await this.db.query('drop table if exists image')
  }

  // ID

  getNextImageId() {
    return this.nextImageId++
  }

  setNextImageId(id: number) {
    this.nextImageId = id
  }

  // Query

  async insertImage(image: Image) {
    const pack = packOf(image)
    return this.db.query('insert into image set ?', pack)
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

  async findImageList(offset: number = 0, ps: number = 128) {
    const r = await this.db.query(
      'select * from image order by cdate desc limit ?, ?',
      [offset, ps]
    )
    unpackList(r)
    return r as Image[]
  }

  async findImageListByUser(uid: number, offset: number = 0, ps: number = 128) {
    const r = await this.db.query(
      'select * from image where uid = ? order by cdate desc limit ?, ?',
      [uid, offset, ps]
    )
    unpackList(r)
    return r as Image[]
  }

  async findImageListByCdate(d: Date, offset: number = 0, ps: number = 128) {
    const r = await this.db.query(
      'select * from image where cdate < ? order by cdate desc limit ?, ?',
      [d, offset, ps]
    )
    unpackList(r)
    return r as Image[]
  }

  async findCdateListByUser(uid: number) {
    const r = await this.db.query(
      'select id, cdate from image where uid = ? order by cdate desc limit ?',
      [uid, this.config.ticketMax]
    )
    return r as { id: number, cdate: Date }[]
  }

  async updateImage(id: number, image: Partial<Image>) {
    const pack = packOf(image)
    const r = await this.db.query('update image set ? where id = ?', [pack, id])
    return r.changedRows as number
  }

  async deleteImage(id: number) {
    await this.db.query('delete from image where id = ?', id)
  }

}

function packOf(image: Partial<Image>) {
  if (image.vers === undefined) {
    return image
  }
  return {
    ...image,
    vers: JSON.stringify(image.vers)
  }
}

function unpack(image: Image) {
  image.vers = JSON.parse(image.vers as string)
}

function unpackList(list: any[]) {
  for (const e of list) {
    e.vers = JSON.parse(e.vers as string)
  }
}
