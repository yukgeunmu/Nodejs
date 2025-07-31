const json = require("./res.json.js");

class Router {
  constructor() {
    this.routes = {};
  }

  addRoute(method, path, handlers) {
    if (!this.routes[method]) {
      this.routes[method] = {};
    }
    this.routes[method][path] = handlers;
  }

  get(path, ...handlers) {
    if (handlers.length === 0) throw new Error("핸들러 함수가 필요합니다.");
    this.addRoute("GET", path, handlers);
  }

  post(path, ...handlers) {
    if (handlers.length === 0) throw new Error("핸들러 함수가 필요합니다.");
    this.addRoute("POST", path, handlers);
  }

  patch(path, ...handlers) {
    if (handlers.length === 0) throw new Error("핸들러 함수가 필요합니다.");
    this.addRoute("PATCH", path, handlers);
  }

  delete(path, ...handlers) {
    if (handlers.length === 0) throw new Error("핸들러 함수가 필요합니다.");
    this.addRoute("DELETE", path, handlers);
  }

  handler(req, res, errorMiddleware) {
    const { url, method } = req;
    // URL 객체를 사용하여 쿼리스트링 등 복잡한 URL로부터 경로(pathname)만 안전하게 추출합니다.
    const parsedUrl = new URL(url, `http://${req.headers.host}`);
    const pathName = parsedUrl.pathname;

    const routesForMethod = this.routes[method] || {};

    let matchedHandlers = null;
    let params = {};

    // 등록된 라우트들을 순회하며 패턴 매칭을 시도합니다.
    for (const routePath in routesForMethod) {
      const paramNames = [];
      // 라우트 경로(예: /character/:id)를 정규식(예: ^/character/([^/]+)$)으로 변환합니다.
      const regexPath = routePath.replace(/:(\w+)/g, (_, paramName) => {
        paramNames.push(paramName);
        return "([^/]+)";
      });
      const regex = new RegExp(`^${regexPath}$`);

      const match = pathName.match(regex);

      // 정규식 매칭에 성공하면,
      if (match) {
        // 핸들러를 찾고,
        matchedHandlers = routesForMethod[routePath];
        // 파라미터(예: { id: '123' })를 추출합니다.
        paramNames.forEach((name, index) => {
          params[name] = match[index + 1];
        });
        // req 객체에 파싱된 파라미터를 추가합니다.
        req.params = params;
        break; // 일치하는 첫 번째 라우트를 찾으면 순회를 중단합니다.
      }
    }

    if (matchedHandlers && matchedHandlers.length > 0) {
      let i = 0;
      const next = async (err) => {
        if (err) {
          return errorMiddleware(err, req, res);
        }
        if (i < matchedHandlers.length) {
          try {
            await matchedHandlers[i++](req, res, next);
          } catch (error) {
            errorMiddleware(error, req, res);
          }
        }
      };
      next();
    } else {
      // 일치하는 라우트가 없으면 404 에러를 응답합니다.
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "404 Not Found" }));
    }
  }
}

module.exports = Router;
