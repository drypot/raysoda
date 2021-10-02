export type Config = {
  appName: string
  appNamel: string
  appDesc: string

  port: number
  cookieSecret: string
  uploadDir: string

  mainUrl: string
  uploadUrl: string

  mysqlServer: string
  mysqlDatabase: string
  mysqlUser: string
  mysqlPassword: string

  mailServer: string

  ticketGenInterval: number
  ticketMax: number

  dev: boolean
}

export type ConfigMin = {
  appName: string
  appNamel: string
  appDesc: string

  mainUrl: string
  uploadUrl: string
}

export function newConfigMin(config: Config): ConfigMin {
  return {
    appName: config.appName,
    appNamel: config.appNamel,
    appDesc: config.appDesc,

    mainUrl: config.mainUrl,
    uploadUrl: config.uploadUrl
  }
}
