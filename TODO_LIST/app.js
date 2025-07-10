import express from 'express';
import connect from './schemas/index.js';
import TodosRouter from './routes/todos.router.js';


// Express 애플리케이션 인스턴스를 생성하는 코드
const app = express();
const PORT = 3000;

connect();

// 미들웨어 등록
app.use(express.json()); // 클라이언트가 보낸 JSON 형식의 body 데이터를 자동으로 파싱해서 req.body에 넣어줌, 즉, POST 요청에서 JSON을 바로 읽을 수 있게 해줍니다

// URL-encoded 형식의 body 데이터를 자동으로 파싱해서 req.body에 넣어줍니다.
// 주로 HTML <form> 전송에서 사용됩니다
// name=gm%20y&age=34  ← 이런 데이터 => { name: 'gm y', age: '34' }
app.use(express.urlencoded({extended: true}));


// static Middleware, express.static()을 사용하여 정적 파일을 제공합니다.
// 입력 값(지금은 "./assets") 경로에 있는 파일을 아무런 가공 없이 그대로 전달해주는 미들웨어에요!
app.use(express.static('./assets'));

// Express 라우터 인스턴스를 생성합니다.
// 여기서 만든 router는 미니 Express 앱이라고 생각
// 주로 URL 경로별로 묶어서 관리할 때 사용
// 
const router = express.Router();

// router에 GET 요청을 등록
// 경로는 라우터 내부 경로
// 나중에 /api랑 합쳐져서 최종 경로 /api/
// 이 경로로 GET 요청을 보내면 JSON 데이터를 응답합니다:
router.get('/',(req, res) =>{
    return res.json({message: 'Hi!'});
})

app.use((req, res, next) =>
{
    console.log('Request URL:', req.originalUrl, ' - ', new Date());
    next();
})


// 라우터를 /api 경로에 연결합니다.
// 이제 /api로 들어오는 요청은 모두 위의 router가 처리합니다.
// /api 주소로 접근하였을 때, router와 TodosRouter로 클라이언트의 요청이 전달됩니다.
app.use('/api', [router, TodosRouter]);

// 서버를 **지정한 포트(PORT)**로 실행합니다.
app.listen(PORT, () => {
    console.log(PORT, '포트로 서버가 열렸어요.!');
});

// [클라이언트] → GET /api/ → [서버(router)] → JSON 응답