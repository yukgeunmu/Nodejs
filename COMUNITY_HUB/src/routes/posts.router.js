import express from "express";
import { prisma } from "../utils/prisma/index.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

//  **[게시판 프로젝트] 게시글 생성 API 비즈니스 로직**

// 1. 게시글을 작성하려는 클라이언트가 로그인된 사용자인지 검증합니다.
// 2. 게시글 생성을 위한 `title`, `content`를 **body**로 전달받습니다.
// 3. **Posts** 테이블에 게시글을 생성합니다.\

router.post("/posts", authMiddleware, async (req, res, next) => {
  const { userId } = req.user;
  const { title, content } = req.body;

  const post = await prisma.posts.create({
    data: {
      userId: +userId,
      title,
      content,
    },
  });

  return res.status(201).json({ data: post });
});

router.get("/posts", async (req, res, next) => {
  const posts = await prisma.posts.findMany({
    select: {
      postId: true,
      userId: true,
      title: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: {
        createdAt: 'desc'// 게시그을 최신순으로 정렬
    }
  });

  return res.status(200).json({ data: posts });
});

router.get("/:postId", async (req, res, next) => {
  const { postId } = req.params;

  const post = await prisma.posts.findFirst({
    where: { postId: +postId },
    select: {
      postId: true,
      userId: true,
      title: true,
      content: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return res.status(200).json({data: post});
});

router;

export default router;
