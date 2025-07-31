const http = require("http");
const PORT = 3000;
require("./lib/res.json.js");
const Router = require("./lib/router");
const jsonBodyParser = require("./src/middleware/bodyParser.js");
const UserService = require("./src/service/user.service.js");
const ErroMiddleware = require("./src/middleware/errorMiddleware.js");
const authMiddleware = require("./src/middleware/authMiddleware.js");
const prisma = require("./src/utils/prisma/index.js");
const HttpError = require("./src/service/httpError.js");
const characterMiddleware = require("./src/middleware/characterMiddleware.js");
const { flushCompileCache } = require("module");
const { resourceUsage } = require("process");

const mainRouter = new Router();
const userService = new UserService();

const server = http.createServer((req, res) => {
  // bodyParser를 먼저 적용하고, 그 다음 router handler를 실행합니다.
  // router handler에 에러 미들웨어를 전달합니다.
  jsonBodyParser(req, res, () => mainRouter.handler(req, res, ErroMiddleware));
});

server.listen(PORT, () => {
  console.log("Server is running at http://localhost:3000");
});

// 회원가입 api (try-catch 제거)
mainRouter.post("/sign-up", async (req, res) => {
  const userInfo = req.body;
  await userService.signUp(userInfo);
  return res.status(200).json({ message: `회원가입에 성공하였습니다.` });
});

// 로그인 api (try-catch 제거)
mainRouter.post("/sign-in", async (req, res) => {
  const { userId, password } = req.body;
  const { accessToken, refreshToken } = await userService.signIn(
    userId,
    password
  );
  res.setHeader("Set-Cookie", [
    `accessToken=Bearer ${accessToken}; Path=/`,
    `refreshToken=Bearer ${refreshToken}; Path=/`,
  ]);
  return res.status(200).json({ message: "로그인에 성공했습니다." });
});

// 캐릭터 생성 api (try-catch 제거)
mainRouter.post("/character", authMiddleware, async (req, res) => {
  const { charactername } = req.body;
  const { accountId } = req.user;

  const isCharacter = await prisma.character.findFirst({
    where: { charactername },
  });

  if (isCharacter) {
    throw new HttpError("존재하는 캐릭터명입니다.", 409);
  }

  await prisma.character.create({
    data: {
      accountId,
      charactername,
      health: 500,
      power: 100,
      money: 10000,
    },
  });

  return res
    .status(200)
    .json({ message: `${charactername}이 생성되었습니다.` });
});

// 캐릭터 삭제 api
mainRouter.delete(
  "/character/:characterId",
  authMiddleware,
  characterMiddleware,
  async (req, res) => {
    const character = req.character;

    await prisma.character.delete({
      where: { characterId: +character.characterId },
    });

    return res.status(200).json({ message: "캐릭터가 삭제되었습니다." });
  }
);

//캐릭터 조회 api
mainRouter.get("/character/:characterId", authMiddleware, async (req, res) => {
  const { characterId } = req.params;
  const { accountId } = req.user;

  const character = await prisma.character.findFirst({
    where: { characterId: +characterId },
  });

  if (!character) {
    throw new HttpError("존재하지 않는 캐릭터 입니다.", 404);
  }

  if (character.accountId !== accountId) {
    return res.status(200).json({
      name: character.charactername,
      health: character.health,
      power: character.power,
    });
  } else {
    return res.status(200).json({
      name: character.charactername,
      health: character.health,
      power: character.power,
      money: character.money,
    });
  }
});

//아이템 생성 API
mainRouter.post("/item", async (req, res) => {
  const itemInfo = req.body;

  const item = await prisma.items.findFirst({
    where: { itemName: itemInfo.itemName },
  });

  if (item) {
    throw new HttpError("이미 존재하는 아이템 입니다.", 404);
  }

  await prisma.items.create({
    data: {
      itemName: itemInfo.itemName,
      itemStat: itemInfo.itemStat,
      itemPrice: itemInfo.itemPrice,
      itemType: itemInfo.itemType,
    },
  });

  return res.status(200).json({ message: "아이템이 생성되었습니다." });
});

//아이템 수정 API
mainRouter.patch("/item/:itemId", async (req, res) => {
  const { itemId } = req.params;
  const { itemName, itemStat } = req.body;

  const item = await prisma.items.findFirst({
    where: { itemId: +itemId },
  });

  if (!item) {
    throw new HttpError("아이템 조회에 실패했습니다.", 404);
  }

  await prisma.items.update({
    where: { itemId: +itemId },
    data: {
      itemName,
      itemStat,
    },
  });

  return res.status(200).json({ message: "아이템 내용을 변경했습니다." });
});

//아이템 목록 조회 API
mainRouter.get("/item", async (req, res) => {
  const data = await prisma.items.findMany({
    select: {
      itemId: true,
      itemName: true,
      itemPrice: true,
    },
  });

  const transformedData = data.map((item) => ({
    item_code: item.itemId,
    item_name: item.itemName,
    item_price: item.itemPrice,
  }));

  return res.status(200).json(transformedData);
});

// 아이템 상세 조회 API
mainRouter.get("/item/:itemId", async (req, res) => {
  const { itemId } = req.params;

  const data = await prisma.items.findFirst({
    where: { itemId: +itemId },
    select: {
      itemId: true,
      itemName: true,
      itemStat: true,
      itemPrice: true,
      itemType: true,
    },
  });

  if (!data) {
    throw new HttpError("아이템 조회에 실패하였습니다", 404);
  }

  return res.status(200).json(data);
});

// 아이템 구매 API
mainRouter.post(
  "/buy/:characterId",
  authMiddleware,
  characterMiddleware,
  async (req, res) => {
    const itemList = req.body;
    const character = req.character;

    let totalPrice = 0;

    await prisma.$transaction(async (tx) => {
      for (let i = 0; i < itemList.length; i++) {
        const price = await tx.items.findFirst({
          where: { itemId: itemList[i].itemId },
          select: {
            itemPrice: true,
          },
        });

        if (!price) {
          throw new HttpError(
            `해당 아이템은 판매하지 않습니다. 아이템 번호(${itemList[i].itemId})`,
            404
          );
        }

        totalPrice += price.itemPrice * itemList[i].count;
      }

      if (character.money < totalPrice) {
        throw new HttpError("돈이 부족합니다.");
      }

      await tx.character.update({
        where: { characterId: character.characterId },
        data: {
          money: character.money - totalPrice,
        },
      });

      for (let i = 0; i < itemList.length; i++) {
        const isItemInventory = await tx.inventoryItem.findFirst({
          where: {
            characterId: character.characterId,
            itemId: itemList[i].itemId,
          },
          select: {
            inventoryItemId: true,
            quantity: true,
          },
        });

        if (isItemInventory) {
          const addCount = isItemInventory.quantity + itemList[i].count;
          await tx.inventoryItem.update({
            where: { inventoryItemId: isItemInventory.inventoryItemId },
            data: {
              quantity: addCount,
            },
          });
        } else {
          await tx.inventoryItem.create({
            data: {
              characterId: character.characterId,
              itemId: itemList[i].itemId,
              quantity: itemList[i].count,
            },
          });
        }
      }
    });

    return res.status(200).json({ message: "아이템을 구매하였습니다." });
  }
);

// 아이템 판매 API
mainRouter.delete(
  "/sell/:characterId",
  authMiddleware,
  characterMiddleware,
  async (req, res) => {
    const itemList = req.body;
    const character = req.character;

    let totalPrice = 0;

    if (!itemList) {
      throw new HttpError("판매 할 아이템을 선택하지 않았습니다.", 404);
    }

    await prisma.$transaction(async (tx) => {
      for (let i = 0; i < itemList.length; i++) {
        const price = await tx.inventoryItem.findFirst({
          where: {
            characterId: character.characterId,
            itemId: itemList[i].itemId,
          },
          select: {
            item: {
              select: {
                itemPrice: true,
              },
            },
          },
        });

        if (!price) {
          throw new HttpError(
            `해당 아이템은 인벤토리에 없습니다. 아이템 번호(${itemList[i].itemId})`,
            404
          );
        }

        totalPrice += price.item.itemPrice * 0.6 * itemList[i].count;
      }

      await tx.character.update({
        where: { characterId: character.characterId },
        data: {
          money: character.money + totalPrice,
        },
      });

      for (let i = 0; i < itemList.length; i++) {
        const itemQuantity = await tx.inventoryItem.findFirst({
          where: {
            characterId: character.characterId,
            itemId: itemList[i].itemId,
          },
        });

        const result = itemQuantity.quantity - itemList[i].count;

        if (result <= 0) {
          await tx.inventoryItem.delete({
            where: {
              inventoryItemId: itemQuantity.inventoryItemId,
            },
          });
        } else {
          await tx.inventoryItem.update({
            where: {
              inventoryItemId: itemQuantity.inventoryItemId,
            },
            data: {
              quantity: result,
            },
          });
        }
      }
    });

    return res.status(200).json({ message: "아이템을 판매하였습니다." });
  }
);

// 아이템 목록 조회 API
mainRouter.get(
  "/inventory/:characterId",
  authMiddleware,
  characterMiddleware,
  async (req, res) => {
    const character = req.character;

    const inventoryData = await prisma.inventoryItem.findMany({
      where: { characterId: character.characterId },
      select: {
        itemId: true,
        quantity: true,
        item: {
          select: {
            itemName: true,
          },
        },
      },
    });

    const transformInventory = inventoryData.map((inventory) => ({
      item_code: inventory.itemId,
      item_name: inventory.item.itemName,
      count: inventory.quantity,
    }));

    return res.status(200).json(transformInventory);
  }
);

// 아이템 장착 API
mainRouter.post(
  "/equip/:characterId",
  authMiddleware,
  characterMiddleware,
  async (req, res) => {
    const character = req.character;
    const { itemId } = req.body;

    const selectItem = await prisma.items.findFirst({
      where: { itemId },
      select: { itemType: true },
    });

    await prisma.$transaction(async (tx) => {
      const itemInventory = await tx.inventoryItem.findFirst({
        where: { characterId: character.characterId, itemId },
      });

      if (!itemInventory) {
        throw new HttpError("인벤토리에 아이템이 없습니다.", 404);
      }

      const isEquippedItem = await tx.equippedItem.findFirst({
        where: {
          AND: [{ characterId: character.characterId }, { itemId: itemId }],
        },
      });

      if (isEquippedItem) {
        throw new HttpError("이미 장착 중인 아이템입니다.", 404);
      }

      const isActiveSlot = await tx.equippedItem.findFirst({
        where: { slot: selectItem.itemType },
      });

      if (isActiveSlot) {
        throw new HttpError("빈 슬롯이 아닙니다. 해제하고 장착해주세요.", 404);
      }

      const equippedItme = await tx.equippedItem.create({
        data: {
          characterId: character.characterId,
          itemId: itemId,
          slot: selectItem.itemType,
        },
      });

      const equippedStat = await tx.equippedItem.findFirst({
        where: { equippedItemId: equippedItme.equippedItemId },
        select: {
          item: {
            select: {
              itemStat: true,
            },
          },
        },
      });

      const { health = 0, power = 0 } = equippedStat.item.itemStat;

      await tx.character.update({
        where: { characterId: character.characterId },
        data: {
          health: character.health + health,
          power: character.power + power,
        },
      });

      await tx.inventoryItem.update({
        where: {
          characterId_itemId: {
            characterId: character.characterId,
            itemId: itemId,
          },
        },
        data: {
          quantity: {
            decrement: 1,
          },
        },
      });
    });

    return res.status(200).json({ message: "아이템을 장착 하였습니다." });
  }
);

// 아이템 장착 해제 API
mainRouter.delete(
  "/removeEquip/:characterId",
  authMiddleware,
  characterMiddleware,
  async (req, res) => {
    const character = req.character;
    const { itemId } = req.body;

    const isEquippedItem = await prisma.equippedItem.findFirst({
      where: {
        AND: [{ characterId: character.characterId }, { itemId: itemId }],
      },
      include: {
        character: true,
        item: true,
      },
    });

    if (!isEquippedItem) {
      throw new HttpError("해당 아이템을 장착하지 않았습니다.", 404);
    }

    await prisma.$transaction(
      async (tx) => {
        await tx.equippedItem.delete({
          where: { equippedItemId: isEquippedItem.equippedItemId },
        });

        const { health: statHealth = 0, power: statPower = 0 } =
          isEquippedItem.item.itemStat;

        const result = await tx.character.update({
          where: { characterId: character.characterId },
          data: {
            health: character.health - statHealth,
            power: character.power - statPower,
          },
        });

        const isExitItmeToInventory = await tx.inventoryItem.findFirst({
          where: { characterId: character.characterId, itemId },
        });

        // 인벤토리에서 수량 늘리기
        if (isExitItmeToInventory) {
          await tx.inventoryItem.update({
            where: { inventoryItemId: isExitItmeToInventory.inventoryItemId },
            data: {
              quantity: {
                increment: 1,
              },
            },
          });
        } else {
          await tx.inventoryItem.create({
            data: {
              characterId: character.characterId,
              itemId,
            },
          });
        }
      },
      {
        // isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted,
      }
    );

    return res.status(200).json({ message: "아이템을 해제 하였습니다." });
  }
);
