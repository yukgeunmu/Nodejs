const HttpError = require("../service/httpError.js");
const prisma = require('../utils/prisma/index.js');

async function characterMiddleware(req, res, next) {
  const { characterId } = req.params;
  const { accountId } = req.user;

  const character = await prisma.character.findFirst({
    where: { characterId: +characterId },
  });

  if (!character) {
    throw new HttpError("존재하지 않는 캐릭터 입니다.", 404);
  }

  if (accountId !== character.accountId) {
    throw new HttpError("접근 권한이 없습니다.", 404);
  }

  req.character = character;
  next();
}

module.exports = characterMiddleware;
