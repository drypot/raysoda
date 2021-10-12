import { ErrorConst } from '../_type/error'

export function newErrorConst(name: string, message: string = '', field: string = ''): ErrorConst {
  return {
    name,
    message,
    field
  }
}

export function logError(list: any, logger = console.log) {
  if (list instanceof Array) {
    for (const e of list) {
      logger(e.message)
    }
    return
  }
  logger(list)
}
