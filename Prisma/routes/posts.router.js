// routes/posts.router.js

import express from 'express';
import {prisma} from '../utils/prisma/index.js'

const router = express.Router(); // express.Router()를 이용해 라우터를 생성합니다.



// 게시글 생성
router.post('/posts', async (req, res, next) => {
  const { title, content, password } = req.body;
  const post = await prisma.posts.create({
    data: {
      title,
      content,
      password,
    },
  });

  return res.status(201).json({ data: post });
});

router.get('/posts', async(req, res, next) => {
    const posts = await prisma.posts.findMany({
        select: {
            postId: true,
            title: true,
            createdAt: true,
            updatedAt: true,
        }
    });

    return res.status(200).json({data: posts});
});


// routes/posts.router.js

/** 게시글 상세 조회 API **/
router.get('/posts/:postId', async (req, res, next) => {
  const { postId } = req.params;
  const post = await prisma.posts.findFirst({
    where: { postId: +postId },
    select: {
      postId: true,
      title: true,
      content: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return res.status(200).json({ data: post });
});

router.put('/posts/:postId', async (req, res, next) => {
    const { postId } = req.params;
    const {title, content, password} = req.body;

    const post = await prisma.posts.findUnique({
        where:{
            postId: +postId
        }
    });

    if(!post) return res.status(404).json({messsage: '게시글이 존재하지 않습니다.'});

    if(post.password !== password) return res.status(401).json({messsage: '비밀번호가 일치하지 않습니다.'});

    await prisma.posts.update({
        data:{title, content},
        where:{
            postId: +postId,
            password,
        }
    });

    return res.status(200).json({data: '게시글이 수정되었습니다.'});
});

router.delete('/posts/:postId', async (req, res, next) => {
    const { postId } = req.params;
    const { password } = req.body;

    const post = await prisma.posts.findFirst({
        where: {
            postId: +postId,
        }
    });

    if(!post) return res.status(404).json({messsage: '게시글이 존재하지 않습니다.'});

    if(post.password !== password) return res.status(401).json({messsage: '비밀번호가 일치하지 않습니다.'});

    await prisma.posts.delete({
        where:{
            postId: +postId
        }
    });

    return res.status(200).json({data: '데이터가 삭제되었습니다.'});
    
});




export default router;