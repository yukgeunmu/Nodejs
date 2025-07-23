import express from "express";
import { prisma } from "../utils/prisma/index.js";
import bcrpyt from "bcrypt";
import jwt from "jsonwebtoken";
import authMiddleware from "../middlewares/auth.middleware.js";
import { Prisma } from "@prisma/client";

const router = express.Router();

// **[게시판 프로젝트] 회원가입 API 비즈니스 로직**

// 1. `email`, `password`, `name`, `age`, `gender`, `profileImage`를 **body**로 전달받습니다.
// 2. 동일한 `email`을 가진 사용자가 있는지 확인합니다.
// 3. **Users** 테이블에 `email`, `password`를 이용해 사용자를 생성합니다.
// 4. **UserInfos** 테이블에 `name`, `age`, `gender`, `profileImage`를 이용해 사용자 정보를 생성합니다.

router.post("/sign-up", async (req, res, next) => {
  try {
    const { email, password, name, age, gender, profileImaage } = req.body;
    const isExistEmail = await prisma.users.findFirst({
      where: {
        email,
      },
    });

    if (isExistEmail) {
      return res.status(409).json({ message: "이미 존재하는 이메일 입니다." });
    }

    const hashedPassword = await bcrpyt.hash(password, 10); // 사용자 비밀번호를 암호화

    const [user, userInfo] = await prisma.$transaction(
      async (tx) => {
        const user = await tx.users.create({
          data: {
            email,
            password: hashedPassword,
          }, // 암호화된 비밀번호를 저장
        });

        const userInfo = await tx.userInfos.create({
          data: {
            userId: user.userId,
            name,
            age,
            gender: gender.toUpperCase(),
            profileImaage,
          },
        });

        // 콜백 함수의 리턴값으로 사용자와 사용자 정보를 반환합니다.
        return [user, userInfo];
      },
      {
        isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted,
      }
    );

    return res.status(201).json({ message: "회원가입이 완료되었습니다." });
  } catch (err) {
    next(err);
  }
});

// 1. `email`, `password`를 **body**로 전달받습니다.
// 2. 전달 받은 `email`에 해당하는 사용자가 있는지 확인합니다.
// 3. 전달 받은 `password`와 데이터베이스의 저장된 `password`를 bcrypt를 이용해 검증합니다.
// 4. 로그인에 성공한다면, 사용자에게 JWT를 발급합니다.

router.post("/sign-in", async (req, res, next) => {
  const { email, password } = req.body;
  const user = await prisma.users.findFirst({ where: { email } });

  if (!user)
    return res.status(409).json({ message: "존재하지 않는 이메일 입니다." });

  if (!(await bcrpyt.compare(password, user.password)))
    return res.status(401).json({ message: "비밀번호가 일치하지 않습니다." });

  const token = jwt.sign(
    {
      userId: user.userId,
    },
    "custom-secret-key"
  );

  res.cookie("authorization", `Bearer ${token}`);
  return res.status(200).json({ message: "로그인 성공" });
});

// src/routes/users.route.js

/** 사용자 조회 API **/
router.get("/users", authMiddleware, async (req, res, next) => {
  const { userId } = req.user;

  const user = await prisma.users.findFirst({
    where: { userId: +userId },
    select: {
      userId: true,
      email: true,
      createdAt: true,
      updatedAt: true,
      userInfos: {
        // 1:1 관계를 맺고있는 UserInfos 테이블을 조회합니다.
        select: {
          name: true,
          age: true,
          gender: true,
          profileImage: true,
        },
      },
    },
  });

  return res.status(200).json({ data: user });
});

// **[게시판 프로젝트] 사용자 정보 변경 API 비즈니스 로직**

// 1. 클라이언트가 로그인된 사용자인지 검증합니다.
// 2. 변경할 사용자 정보 `name`, `age`, `gender`, `profileImage`를 **body**로 전달받습니다.
// 3. **사용자 정보(UserInofes) 테이블**에서 **사용자의 정보들**을 수정합니다.
// 4. 사용자의 **변경된 정보 이력**을 **사용자 히스토리(UserHistories)** 테이블에 저장합니다.
// 5. 사용자 정보 변경 API를 완료합니다.

router.patch("/users", authMiddleware, async (req, res, next) => {
  try {
    const updateData = req.body;
    const { userId } = req.user;

    const userInfo = await prisma.userInfos.findFirst({
      where: { userId: +userId },
    });

    if (!userInfo)
      return res.status(404).json({ message: "존재하지 않는 아이디 입니다." });

    await prisma.$transaction(
      async (tx) => {
        await tx.userInfos.update({
          data: {
            ...updateData,
          },
          where: {
            userId: +userId,
            //userId: userInfo.userId,
          },
        });

        //   userId        Int      @map("userId") // 사용자(Users) 테이블을 참조하는 외래키
        // changedField  String   @map("changedField") // 변경된 필드명
        // oldValue      String?  @map("oldValue") // 변경 전 값
        // newValue      String   @map("newValue") // 변경 후 값
        for (let key in updateData) {
          if (userInfo[key] !== updateData[key]) {
            await tx.userHistories.create({
              data: {
                userId: userInfo.userId,
                changedField: key,
                oldValue: String(userInfo[key]),
                newValue: String(updateData[key]),
              },
            });
          }
        }
      },
      {
        isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted,
      }
    );

    return res
      .status(200)
      .json({ message: "사용자 정보 변경에 성공하였습니다." });
  } catch (err) {
    next(err);
  }
});

export default router;
