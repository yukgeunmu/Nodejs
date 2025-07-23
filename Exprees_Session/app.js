import express from 'express';
import session from 'express-session';
import expressSession from 'express-session';

const app = express();
const PORT = 3019;

app.use(express.json());
app.use(
  expressSession({
    secret: 'express-session-secret-key.', // 세션을 암호화하는 비밀 키를 설정
    resave: false, // 클라이언트의 요청이 올 때마다 세션을 새롭게 저장할 지 설정, 변경사항이 없어도 다시 저장
    saveUninitialized: false, // 세션이 초기화되지 않았을 때 세션을 저장할 지 설정
    cookie: {
      // 세션 쿠키 설정
      maxAge: 1000 * 60 * 60 * 24, // 쿠키의 만료 기간을 1일로 설정합니다.
    },
  }),
);

app.post('/sessions', (req, res, next) =>{
    const { userId } = req.body;

    req.session.userId = userId;

    console.log(req.session);

    return res.status(200).json({message: '세션을 설정했습니다.'});
});


app.get('/sessions', (req,res, next) =>{
    return res.status(200).json({
        message: '세션을 조회했습니다.',
        session: req.session.userId ?? null,
    });
});

app.listen(PORT, () => {
  console.log(PORT, '포트로 서버가 열렸어요!');
});