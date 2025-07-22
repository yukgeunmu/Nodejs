// app.js

import express from 'express';
import cookieParser, { signedCookie } from 'cookie-parser';

const app = express();
const PORT = 5001;

app.use(express.json());
app.use(cookieParser());

// 'res.cookie()'를 이용하여 쿠키를 할당하는 API
app.get("/set-cookie", (req, res) => {
  let expires = new Date();
  expires.setMinutes(expires.getMinutes() + 60); // 만료 시간을 60분으로 설정합니다.

  res.cookie('name', 'sparta', {
    expires: expires
  });
  return res.end();
});

// 'req.headers.cookie'를 이용하여 클라이언트의 모든 쿠키를 조회하는 API
app.get('/get-cookie', (req, res) => {
  const cookie = req.headers.cookie;
  console.log(cookie); // name=sparta

  const cookies = req.cookies;
  console.log(cookies)
  return res.status(200).json({ cookie: cookies });
});

let session = {};
app.get('/set-session', function (req, res, next) {
  // 현재는 sparta라는 이름으로 저장하지만, 나중에는 복잡한 사용자의 정보로 변경될 수 있습니다.
  const name = 'sparta';
  const uniqueInt = Date.now();
  // 세션에 사용자의 시간 정보 저장
  session[uniqueInt] = { name };

  res.cookie('sessionKey', uniqueInt);
  return res.status(200).end();
});

app.get('/get-session', function (req, res, next) {
  const { sessionKey } = req.cookies;
  // 클라이언트의 쿠키에 저장된 세션키로 서버의 세션 정보를 조회합니다.
  const name = session[sessionKey];
  return res.status(200).json({ name });
});

app.get('/set', (req, res) =>{
  let expires = new Date();
  expires.setMinutes(expires.getMinutes() + 60); // 만료 시간을 60분으로 설정합니다.

  res.cookie('name', 'nodejs', {
    expires: expires
  });
  return res.end();

});

app.get('/get',(req,res,next) =>{
  const cookies = req.cookies;
  console.log(cookies)
  return res.status(200).json({ cookie: cookies });
});


app.listen(PORT, () => {
  console.log(PORT, '포트로 서버가 열렸어요!');
});