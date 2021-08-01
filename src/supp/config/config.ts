import { readFileSync } from 'fs'

type Config = {
  appName: string
  appNamel: string
  appDesc: string

  port: number
  cookieSecret: string

  siteUrl: string

  uploadSiteUrlUrl: string
  uploadDir: string

  mysqlDatabase: string
  mysqlUser: string
  mysqlPassword: string

  mailServer: string

  ticketGenInterval: number
  ticketMax: number

  dev: boolean
}

export let config: Config

export function loadConfig(path: string) {
  const data = readFileSync(path, 'utf8')
  config = JSON.parse(data)
  config.dev = process.env.NODE_ENV !== 'production'
}

export function loadTestConfig() {
  return loadConfig('config/test.json')
}
