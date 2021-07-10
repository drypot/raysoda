export class UrlMaker {
  constructor(url) {
    this.url = '' + url
    this.qm = false
  }

  add(name, value, def) {
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
