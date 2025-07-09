import express from 'express';

// 익스프레스의 라우터 생성
const router = express.Router();

// routes/goods.js

// localhost:3000/api/ GET
router.get('/', (req, res) => {
  res.json('default url for goods.js GET Method');
});

// localhost:3000/api/about GET
router.get('/about', (req, res) => {
  res.json('goods.js about PATH');
});

export default router;