import express from 'express';
import morgan from 'morgan';
import { readdirSync } from 'node:fs';

const app = express();

app.use(express.json());
app.use(
  morgan('common', {
    skip: (_, res) => res.statusCode < 400,
  })
);

await Promise.all(
  readdirSync('./src/modules').map(async (f) =>
    app.use(`/api/${f.slice(0, -3)}s`, (await import(`./modules/${f}`)).default)
  )
);

app.get('/ping', (_, res) => {
  res.send('pong');
});

export default app.listen(process.env.APP_PORT || 3000);
