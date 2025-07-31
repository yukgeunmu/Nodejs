const http = require("http");

http.ServerResponse.prototype.status = function(statusCode) {
  this.statusCode = statusCode; // Node.js의 기본 statusCode 속성 설정
  return this; // res 객체 자신을 반환하여 메서드 체이닝 가능
};

http.ServerResponse.prototype.json = function(data) {
  this.setHeader('Content-Type', 'application/json'); // Content-Type 헤더 설정
  this.end(JSON.stringify(data)); // 데이터를 JSON 문자열로 변환하여 응답 종료
};
