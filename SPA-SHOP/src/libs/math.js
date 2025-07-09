
export default function () {
  console.log('src/libs/math.js 파일입니다.');
}

export class Math{
  
  constructor(a,b)
  {
    this._a = a;
    this._b = b;
  }

  get a() {
    return this._a;
  }

  set a(value) {
    this._a = value;
  }

  get b() {
    return this._b;
  }

  set b(value) {
    this._b = value;
  }

  Add()
  {
     return this._a + this._b;
  }

  Subtract()
  {
    return this._a - this._b;
  }

}
