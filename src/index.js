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

readdirSync('./src/modules').forEach(async (f) => {
  app.use(`/api/${f.slice(0, -3)}s`, (await import(`./modules/${f}`)).default);
});

app.get('/ping', (_, res) => {
  res.send('pong');
});

app.listen(process.env.APP_PORT, () => {
  if (process.env.NODE_ENV === 'test')
    readdirSync('./src/tests').map((f) => import(`./tests/${f}`));
});
