import { app } from './controller.js'

app.get('/ping', (_, res) => {
  res.send('pong')
})

app.listen(3000)