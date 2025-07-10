import express from 'express';

// mongooose, Goods 모델 가져오기
import mongoose from 'mongoose';
import Goods from '../schemas/goods.js';
import goods from '../schemas/goods.js';

const router = express.Router();


router.post('/goods', async (req, res) =>{

  // 클라이언트로 부터 전달 받은 데이터를 가져온다
  const {goodsId, name, thumbnailUrl, category, price} = req.body;

  //goodsId 중복되지 않았는지 검사한다. 실제로 MongoDB에 데이터를 조회해서, 해당하는 데이터가 MongoDB에 존재하는지 확인한다.
  const goods = await Goods.find({goodsId: goodsId}).exec(); // 데이터를 생성할 때는 사용이 안되기 때문에, 데이터를 조회할 때 사용한다.


  //만약 goodsId가 중복된다면, 에러메시지를 전달한다,
  if(goods.length){
    return  res.status(400).json({errorMessage: '이미 존재하는 데이터입니다.'});
  };

  // 상품을 생성한다
  const createGoods = await Goods.create({
    goodsId: goodsId,
    name: name,
    thumbnailUrl: thumbnailUrl,
    category: category,
    price: price,
  });

  return res.status(201).json({goods: createGoods});

});



export default router;