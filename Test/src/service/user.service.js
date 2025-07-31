
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../utils/prisma/index.js');
const dotenv = require('dotenv');
const HttpError = require('./httpError.js');
const cookieParser = require("cookie-parser");

dotenv.config();

const IsValidInput = (str) => {
  const regex = /^[a-z0-9]+$/;
  return regex.test(str);
};

class UserService {
  signUp = async (userInfo) => {
    if (!userInfo.userId || !userInfo.password || !userInfo.passwordCheck || !userInfo.name) {
      throw new HttpError('모든 필드를 입력해주세요.', 400);
    }

    if (!IsValidInput(userInfo.userId)) {
      throw new HttpError('아이디는 3자 이상의 영문 또는 숫자여야 합니다.', 422);
    }

    if (userInfo.password < 6) {
      throw new HttpError('비밀번호는 6자 이상이어야 합니다.', 422);
    }

    if (userInfo.password !== userInfo.passwordCheck) {
      throw new HttpError('비밀번호가 일치하지 않습니다.', 400);
    }

    const isExistUserId = await prisma.account.findFirst({
      where: { userId: userInfo.userId },
    });

    if (isExistUserId) {
      throw new HttpError('이미 존재하는 아이디 입니다.', 409);
    }

    const hashedPassword = await bcrypt.hash(userInfo.password, 10);

    await prisma.account.create({
      data: {
        userId: userInfo.userId,
        password: hashedPassword,
        name: userInfo.name,
      },
    });
  };

  signIn = async (userId, password) => {
    const user = await prisma.account.findFirst({ where: { userId } });

    if (!user) throw new HttpError('존재하지 않는 계정 입니다.', 409);

    if (!(await bcrypt.compare(password, user.password)))
      throw new HttpError('비밀번호가 일치하지 않습니다.', 401);

    const accessToken = jwt.sign(
      {
        userId: user.userId,
      },
      process.env.ACCESS_TOKEN_SECRET_KEY,
      { expiresIn: '1m' },
    );

    const refreshToken = jwt.sign(
      {
        userId: user.userId,
      },
      process.env.REFRESH_TOKEN_SECRET_KEY,
      { expiresIn: '7d' },
    );

    await prisma.account.update({
      where: { userId },
      data: {
        refreshToken,
      },
    });

    return { accessToken, refreshToken };
  };

  refresh = async (refreshToken) => {
    const [tokenType, token] = refreshToken.split(' ');

    if (tokenType !== 'Bearer') throw new Error('토큰 타입이 일치하지 않습니다.');

    const decodedToken = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET_KEY);
    const userId = decodedToken.userId;

    const user = await prisma.account.findFirst({
      where: { userId },
    });

    if (!user) throw new HttpError('토큰 사용자가 없습니다.', 404);

    return { userId };
  };
}

module.exports = UserService;