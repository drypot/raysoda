import { INVALID_DATA } from '../base/error2.js'
import { loadConfig } from '../config/config.js'
import { Express2 } from './express2.js'
import { Request, Response } from 'express'

const config = loadConfig('config/express-test.json')
const express = new Express2(config)
const router = express.router

router.get('/test/system-error', function (req, res, done) {
  done(new Error('Error Sample'))
})

router.get('/test/form-error', function (req, res, done) {
  done(INVALID_DATA)
})

process.on('uncaughtException', function (err) {
  console.error(err.stack)
  process.exit(1)
})

process.on('SIGINT', function () {
  console.log('SIGINT caught')
  process.exit(1)
})

express.start(() => {
  console.log('express: listening ' + config.port)
  const siteUrl = config.siteUrl
  console.log(siteUrl + '/test/system-error')
  console.log(siteUrl + '/test/form-error')
})
