const express = require('express')
const fs = require('node:fs')

const app = express()

fs.readdirSync('./src/modules').forEach(f => {
  app.use(`/${f.slice(0, -3)}s`, require(`./modules/${f}`).default)
})

app.get('/ping', (_, res) => {
  res.send('pong')
})

app.listen(process.env.APP_PORT)