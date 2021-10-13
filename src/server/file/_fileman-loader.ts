import { RapixelFileManager } from './rapixel-fileman'
import { OsokyFileManager } from './osoky-fileman'
import { DrypotFileManager } from './drypot-fileman'
import { RaySodaFileManager } from './raysoda-fileman'
import { omanGetObject } from '../oman/oman'
import { ImageFileManager } from './_fileman'

export async function omanGetImageFileManager(name: string): Promise<ImageFileManager> {
  const map: any = {
    raysoda: 'RaySodaFileManager',
    rapixel: 'RapixelFileManager',
    osoky: 'OsokyFileManager',
    drypot: 'DrypotFileManager',
  }
  return await omanGetObject(map[name])
}
