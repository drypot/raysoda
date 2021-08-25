import { exec } from 'child_process'

export interface ImageMeta {
  format: string | undefined
  width: number
  height: number
  shorter: number
}

export function imageMetaOf(params: Partial<ImageMeta>): ImageMeta {
  return {
    format: undefined,
    width: 0,
    height: 0,
    shorter: 0,
    ...params
  }
}

export function identify(path: string): Promise<ImageMeta> {
  return new Promise((resolve, reject) => {
    // identify 에 -auto-orient 를 적용할 수가 없어서 mogrify 를 할 수 없이 한번 한다.
    exec('identify -format "%m %w %h" ' + path, function (err, stdout, stderr) {
      if (err) {
        resolve({
          format: undefined,
          width: 0,
          height: 0,
          shorter: 0
        })
        return
      }
      const a = stdout.split(/[ \n]/)
      const width = parseInt(a[1]) || 0
      const height = parseInt(a[2]) || 0
      resolve({
        format: a[0].toLowerCase(),
        width: width,
        height: height,
        shorter: width > height ? height : width
      })
    })
  })
}
