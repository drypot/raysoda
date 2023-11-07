// 사용하진 않지만 import 가 들어와 있어야 omanGet 이 가능하다.
import { RapixelFileManager } from '@server/fileman/rapixel-fileman'
import { OsokyFileManager } from '@server/fileman/osoky-fileman'
import { DrypotFileManager } from '@server/fileman/drypot-fileman'
import { RaySodaFileManager } from '@server/fileman/raysoda-fileman'
import { SobeautFileManager } from '@server/fileman/sobeaut-fileman'

import { getObject } from '@server/oman/oman'
import { ImageFileManager } from '@server/fileman/_fileman'

export async function getImageFileManager(name: string): Promise<ImageFileManager> {
  const map: any = {
    raysoda: 'RaySodaFileManager',
    rapixel: 'RapixelFileManager',
    osoky: 'OsokyFileManager',
    drypot: 'DrypotFileManager',
    sobeaut: 'SobeautFileManager'
  }
  return await getObject(map[name])
}
