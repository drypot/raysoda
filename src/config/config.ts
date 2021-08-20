import { readFileSync } from 'fs'

export type Config = {
  appName: string
  appNamel: string
  appDesc: string

  port: number
  cookieSecret: string

  siteUrl: string

  uploadSiteUrlUrl: string
  uploadDir: string

  mysqlServer: string
  mysqlDatabase: string
  mysqlUser: string
  mysqlPassword: string

  mailServer: string

  ticketGenInterval: number
  ticketMax: number

  dev: boolean
}

export function configFrom(path: string): Config {
  const data = readFileSync(path, 'utf8')
  const config: Config = JSON.parse(data)
  return config
}
