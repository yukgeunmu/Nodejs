// app.js

import express from 'express';
import goodsRouter from './routes/goods.js'
import newsRouter from './routes/news.js';
import connect from './schemas/index.js';


const app = express();
const PORT = 3000;

connect();

// Express에서 req.body에 접근하여, body 데이터를 사용할 수 있도록 설정하는 미들웨어
app.use(express.json());// json 형태로 서버에 body 데이터를 전달함ㄴ, req.body에 데이터를 변환하여 넣어준다
app.use(express.urlencoded({ extended: true}));// form cotent type에서 body 데이터를 전달하면, req.body에 데이터를 변환하여 넣어준다.


app.get('/', (req, res) => {
  res.send('Hello World!');
});

// localhost:3000/api -> goodsRouter
// localhost:3000/api -> newsRouter
// 2. 라우터를 등록 합니다.
app.use('/api', [goodsRouter, newsRouter]);


app.listen(PORT, () => {
  console.log(PORT, '포트로 서버가 열렸어요!');
});


app.use('/api', [goodsRouter]);