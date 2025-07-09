// app.js

import express from 'express';
import goodsRouter from './routes/goods.js'

const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(PORT, () => {
  console.log(PORT, '포트로 서버가 열렸어요!');
});


app.use('/api',[goodsRouter]);