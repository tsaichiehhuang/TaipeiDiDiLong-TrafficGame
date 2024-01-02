/**
 * Control the movement and sprite of the player
 */
class PlayerController {
  constructor() {
    this.playerWidth = 50;
    this.playerHeight = 50;
    this.playerSpeed = 5;
    this.playerSprite = null;
  }

  setup = () => {
    this.playerSprite = createSprite(
      width / 2,
      height - 50,
      this.playerWidth,
      this.playerHeight
    );
    this.playerSprite.color = color(0, 150, 255);

    // From p5play doc:
    // 'kinematic' colliders can be moved programmatically but not by other sprites.
    // They also won't collide with other kinematic colliders.
    // this.playerSprite.collider = 'k';

    // 一開始是 collider = kinematic，但會讓 player 無法與其他 collider （車子）自然地碰撞
    // rotationLock = true 可以讓 player 不會因碰撞就旋轉
    this.playerSprite.rotationLock = true;

    // 為了讓玩家的 sprite 在最上面
    this.playerSprite.autodraw = false;

    //load explode image
    this.explosion = loadImage("../images/explosion.png");
  };

  getPlayer = () => {
    return this.playerSprite;
  };

  draw = () => {
    this.playerSprite.draw();
  };

  move = (direction) => {
    // Demo
    if (direction === "up") {
      this.playerSprite.velocity.y = -this.playerSpeed;
    } else if (direction === "down") {
      this.playerSprite.velocity.y = this.playerSpeed;
    } else if (direction === "left") {
      this.playerSprite.velocity.x = -this.playerSpeed;
    } else if (direction === "right") {
      this.playerSprite.velocity.x = this.playerSpeed;
    } else {
      this.playerSprite.velocity.y = 0;
      this.playerSprite.velocity.x = 0;
    }
  };

  update = () => {
    //let player‘s movement range not exceed the road
    let minRoadX = gameManager.getRoadXRange()[0] + this.playerWidth / 2;
    let maxRoadX = gameManager.getRoadXRange()[1] - this.playerWidth / 2;
    if (this.playerSprite.position.x < minRoadX) {
      image(
        this.explosion,
        gameManager.getRoadXRange()[0] - this.playerWidth,
        this.playerSprite.position.y - this.playerHeight,
        100,
        100
      );
      this.playerSprite.position.x = minRoadX;
      this.playerSprite.velocity.x = 0;
    } else if (this.playerSprite.position.x > maxRoadX) {
      image(
        this.explosion,
        gameManager.getRoadXRange()[1] - this.playerWidth,
        this.playerSprite.position.y - this.playerHeight,
        100,
        100
      );
      this.playerSprite.position.x = maxRoadX;
      this.playerSprite.velocity.x = 0;
    }
  };
}
