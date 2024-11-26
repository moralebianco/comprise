import express from 'express'

const app = express()

// TODO add routers

app.get('/ping', (_, res) => {
  res.send('pong')
})

app.listen(process.env.APP_PORT)