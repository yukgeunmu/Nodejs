import jwt from 'jsonwebtoken';

const token = jwt.sign({ myPayloadData: 1234 }, 'mysecretkey');
console.log(token);


const token2 = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJteVBheWxvYWREYXRhIjoxMjM0LCJpYXQiOjE3NTMxNTAzODV9.7wIv8OgBMToU6-lG4GLpMFnlZqjnHvfoChndQzlBEhE";
const decodedValue = jwt.decode(token2);

console.log(decodedValue); // { myPayloadData: 1234, iat: 1690873885 }

const token3 = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJteVBheWxvYWREYXRhIjoxMjM0LCJpYXQiOjE3NTMxNTAzODV9.7wIv8OgBMToU6-lG4GLpMFnlZqjnHvfoChndQzlBEhE";
const decodedValueByVerify = jwt.verify(token, "mysecretkey");

console.log(decodedValueByVerify); // { myPayloadData: 1234, iat: 1690873885 }