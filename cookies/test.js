 let session = {};
  
  const name = 'sparta';
  const a = 'rrrr'
  const uniqueInt = Date.now();

    session[uniqueInt] = {name: a};

    console.log(session);
