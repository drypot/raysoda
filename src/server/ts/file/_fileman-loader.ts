// 사용하진 않지만 import 가 들어와 있어야 omanGet 이 가능하다.
import { RapixelFileManager } from '@server/file/rapixel-fileman'
import { OsokyFileManager } from '@server/file/osoky-fileman'
import { DrypotFileManager } from '@server/file/drypot-fileman'
import { RaySodaFileManager } from '@server/file/raysoda-fileman'

import { omanGetObject } from '@server/oman/oman'
import { ImageFileManager } from '@server/file/_fileman'

export async function omanGetImageFileManager(name: string): Promise<ImageFileManager> {
  const map: any = {
    raysoda: 'RaySodaFileManager',
    rapixel: 'RapixelFileManager',
    osoky: 'OsokyFileManager',
    drypot: 'DrypotFileManager',
  }
  return await omanGetObject(map[name])
}
