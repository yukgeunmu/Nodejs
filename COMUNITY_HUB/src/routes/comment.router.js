import express from 'express';
import { prisma } from '../utils/prisma/index.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/posts/:postId/comments', authMiddleware, async (req, res, next) => {
    const { postId } = req.params;
    const { userId } = req.user;
    const { content } = req.body;
    
    const post = await prisma.posts.findFirst({
        where:{postId: +postId},
    });

    if(!post) return res.status(404).json({message:'게시글이 존재하지 않습니다.'});

    const commnet = await prisma.comments.create({
        data:{
            userId: +userId,
            postId: +postId,
            content,
        }
    });

    return res.status(201).json({data: commnet});
});


router.get('/posts/:postId/comments', async(req, res, next) =>{
    const { postId } = req.params;

    const comments = await prisma.comments.findMany({
        where: {postId: +postId},
        orderBy: {
            createdAt: 'desc',
        }
    });

    return res.status(200).json({data: comments});
});



export default router;