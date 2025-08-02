import { getObject } from '../oman/oman.js'
import { ImageFileManager } from './fileman.js'

import './rapixel-fileman.js'
import './osoky-fileman.js'
import './drypot-fileman.js'
import './raysoda-fileman.js'
import './sobeaut-fileman.js'

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
