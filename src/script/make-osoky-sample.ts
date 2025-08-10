import { getImageMetaOfFile } from '../fileman/magick/magick2.ts'
import { getOsokyFileManaer } from '../fileman/osoky-fileman.ts'
import { initObjectContext } from '../oman/oman.ts'

initObjectContext('config/osoky-test.json')
const ifm = await getOsokyFileManaer()

const meta = await getImageMetaOfFile('sample/4096x2304.jpg')
await ifm.saveImage(1, 'sample/4096x2304.jpg', meta)
