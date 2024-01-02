// p5play 和 planck 的座標轉換
// From https://p5play.org/docs/p5play.js.html#line43
const pl = planck;
const plScale = 60;

// scale to planck coordinates from p5 coordinates
const scaleTo = (x, y, tileSize) =>
  new pl.Vec2((x * tileSize) / plScale, (y * tileSize) / plScale);
// scale from planck coordinates to p5 coordinates
const scaleFrom = (x, y, tileSize) =>
  new pl.Vec2((x / tileSize) * plScale, (y / tileSize) * plScale);
// ----------------------------

/**
 * 回傳 sprite 和 player 的最新碰撞點
 * 相關 function: recordPlayerCollidePoint()
 * @returns {p5.Vector} the newest point where sprite and player are collided
 */
function getCollidedPlayerPoint(sprite) {
  if (!playerCollidePoint.has(sprite.idNum)) {
    console.log(
      `[WARN] getCollidedPlayerPoint: sprite ${sprite.idNum} 沒有任何與玩家碰撞點`
    );
    return createVector(0, 0);
  }
  return playerCollidePoint.get(sprite.idNum);
}

const playerCollidePoint = new Map(); // key: sprite.idNum, value: 最新碰撞點

/**
 * 當碰撞發生前，紀錄所有與玩家碰撞的 sprite 的碰撞點，存在 playerCollidePoint
 * Ref: https://piqnt.com/planck.js/docs/contacts
 */
function recordPlayerCollidePoint() {
  world.on("begin-contact", function (contact) {
    // manifold 做 deep-copy
    let manifold = JSON.parse(JSON.stringify(contact.getManifold()));

    let bodyA = contact.getFixtureA().getBody();
    let bodyB = contact.getFixtureB().getBody();

    // 如果有其中一個是 player，就紀錄
    if (bodyIsSprite(bodyA, player) || bodyIsSprite(bodyB, player)) {
      let otherSprite = bodyIsSprite(bodyA, player)
        ? bodyB.sprite
        : bodyA.sprite;
      let point = manifold.points[0];
      let worldPoint = bodyB.getWorldPoint(point.localPoint); // 不知道為什麼是 bodyB 不是 bodyA
      let collidedPoint = scaleFrom(worldPoint.x, worldPoint.y, 1);

      // 使用 idNum (from p5play) 作為 key
      playerCollidePoint.set(otherSprite.idNum, collidedPoint);
    }
  });
}

function bodyIsSprite(body, sprite) {
  return body.sprite.idNum == sprite.idNum;
}
