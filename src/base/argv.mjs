export function parseArgv(argv = []) {
  const obj = { _: [] }
  let name = null
  for (const arg of argv) {
    if (arg[0] === '-') {
      if (arg[1] === '-') {
        name = arg.slice(2)
      } else {
        name = arg.slice(1)
      }
      obj[name] = true
      continue
    }
    if (name) {
      obj[name] = arg
      name = null
      continue
    }
    if (arg.length > 0) {
      obj._.push(arg)
    }
  }
  return obj
}
