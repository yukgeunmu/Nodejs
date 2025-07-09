import math from './math.js';
import exception from '../exception/base.exception.js'
import authenticationMiddleware from '../middleware/authentication/authentication.middleware.js';
import { Math } from './math.js';


math();
exception();
authenticationMiddleware();

let math1 = new Math(5,4);

console.log(math1.Add());
console.log(math1.Subtract());