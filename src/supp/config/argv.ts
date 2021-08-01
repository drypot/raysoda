export class Argv {
  public opts: { [key: string]: string | boolean }
  public params: string[]

  constructor() {
    this.opts = {}
    this.params = []
  }
}

export function parseArgv(_argv: string[] = []): Argv {
  const argv = new Argv()
  let name = null
  for (const arg of _argv) {
    if (arg[0] === '-') {
      if (arg[1] === '-') {
        name = arg.slice(2)
      } else {
        name = arg.slice(1)
      }
      argv.opts[name] = true
      continue
    }
    if (name) {
      argv.opts[name] = arg
      name = null
      continue
    }
    if (arg.length > 0) {
      argv.params.push(arg)
    }
  }
  return argv
}
