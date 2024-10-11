import { app } from './controllers.js'

app.get('/ping', (_, res) => {
  res.send('pong')
})

app.listen(process.env.APP_PORT)