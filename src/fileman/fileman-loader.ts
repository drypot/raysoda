import { getObject } from '../oman/oman.ts'
import type { ImageFileManager } from './fileman.ts'

import './rapixel-fileman.ts'
import './osoky-fileman.ts'
import './drypot-fileman.ts'
import './raysoda-fileman.ts'
import './sobeaut-fileman.ts'

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
