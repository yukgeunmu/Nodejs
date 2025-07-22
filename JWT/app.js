import express from "express";
import JWT from "jsonwebtoken";
const app = express();

app.post("/login", function (req, res, next) {
  const user = {
    // 사용자 정보
    userId: 203, // 사용자의 고유 아이디 (Primary key)
    email: "archepro84@gmail.com", // 사용자의 이메일
    name: "이용우", // 사용자의 이름
  };

  // 사용자 정보를 JWT로 생성
  const userJWT = JWT.sign(
    user, // user 변수의 데이터를 payload에 할당
    "secretOrPrivateKey", // JWT의 비밀키를 secretOrPrivateKey라는 문자열로 할당
    { expiresIn: "1h" } // JWT의 인증 만료시간을 1시간으로 설정
  );

//   res.cookie("sparta", user); // sparta 라는 이름을 가진 쿠키에 user 객체를 할당합니다.
  
  // userJWT 변수를 sparta 라는 이름을 가진 쿠키에 Bearer 토큰 형식으로 할당
  res.cookie('sparta', userJWT);
  return res.status(200).end();
});

app.listen(5002, () => {
  console.log(5002, "번호로 서버가 켜졌어요!");
});
