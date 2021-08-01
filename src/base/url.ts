export class UrlMaker {

  private url: string
  private qm: boolean

  constructor(url: string) {
    this.url = url
    this.qm = false
  }

  add(name: string, value: any, def?: any) {
    if (def !== undefined && def === value) {
      return this
    }
    if (value === undefined || value === null) {
      return this
    }
    if (!this.qm) {
      this.url += '?'
      this.qm = true
    } else {
      this.url += '&'
    }
    this.url += name
    this.url += '='
    this.url += value
    return this
  }

  gen() {
    return this.url
  }
}
