const jwt = require('jsonwebtoken');
const prisma = require('../utils/prisma/index.js');
const dotenv = require('dotenv');
const HttpError = require('../service/httpError.js');

dotenv.config();

// 이중 함수 구조 제거
async function authMiddleware(req, res, next) {
  try {
    // req.headers.cookies -> req.headers.cookie
    const { cookie } = req.headers;

    if (!cookie) {
      // 에러를 next로 전달하여 중앙 에러 핸들러가 처리하도록 함
      return next(new HttpError('쿠키가 존재하지 않습니다.', 401));
    }

    const cookies = cookie.split(';').reduce((acc, item) => {
      const [key, value] = item.trim().split('=');
      if (key) {
        acc[key] = value;
      }
      return acc;
    }, {});

    const { accessToken } = cookies;

    if (!accessToken) {
      return next(new HttpError('액세스 토큰이 쿠키에 존재하지 않습니다.', 409));
    }

    const [tokenType, token] = accessToken.split(' ');

    if (tokenType !== 'Bearer') {
      return next(new HttpError('토큰 타입이 일치하지 않습니다.', 404));
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY);
    const userId = decodedToken.userId;

    const user = await prisma.account.findFirst({
      where: { userId: userId },
    });

    if (!user) {
      // res.clearCookie('authorization'); // 에러 핸들러에서 처리하는 것이 더 적합할 수 있음
      return next(new HttpError('토큰 사용자가 존재하지 않습니다.', 404));
    }

    req.user = user;
    // return 제거, next() 호출
    next();
  } catch (error) {
    // 에러를 중앙 에러 핸들러로 전달
    switch (error.name) {
      case 'TokenExpiredError':
        return next(new HttpError('토큰이 만료되었습니다.', 401));
      case 'JsonWebTokenError':
        return next(new HttpError('토큰이 조작되었습니다.', 401));
      default:
        // HttpError가 아닌 다른 에러들도 처리
        return next(error);
    }
  }
}

module.exports = authMiddleware;