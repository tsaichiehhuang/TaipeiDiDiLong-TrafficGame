/**
 * Control the movement and sprite of the player
 */
class PlayerController {
  constructor() {
    this.playerSpeed = 5;
    this.playerImg = null;
    this.playerSizeOffset = -20; // 讓 player 的範圍較小一點，去掉透明的區域
  }

  preload = () => {
    this.playerImg = loadImage("images/player/player.png");
  };

  setup = () => {
    this.playerWidth = this.playerImg.width + this.playerSizeOffset;
    this.playerHeight = this.playerImg.height + this.playerSizeOffset;
    
    this.playerSprite = new Sprite(
      width / 2 + (gameManager.getRoadXRange()[1] - width / 2) / 2,
      height - 50,
      this.playerWidth,
      this.playerHeight
    );
    this.playerSprite.img = this.playerImg;

    this.playerSprite.removeColliders();
    this.playerSprite.addCollider(0, 0, 30, 170); // 比較長型的
    this.playerSprite.addCollider(0, -30, 80, 55); // 比較寬的
    this.playerSprite.mass = 5; // 大概是車子的 1/3

    // From p5play doc:
    // 'kinematic' colliders can be moved programmatically but not by other sprites.
    // They also won't collide with other kinematic colliders.
    // this.playerSprite.collider = 'k';

    // 一開始是 collider = kinematic，但會讓 player 無法與其他 collider （車子）自然地碰撞
    // rotationLock = true 可以讓 player 不會因碰撞就旋轉
    this.playerSprite.rotationLock = true;

    // 為了讓玩家的 sprite 在最上面
    this.playerSprite.autodraw = false;

    // 如果沒 remove 的話， allSprites.draw() 會再畫第二次 player
    allSprites.remove(this.playerSprite);

    // Debug 用，可以看到 player 的 collider
    this.playerSprite.debug = gameManager.debugMode;
  };

  getPlayer = () => {
    return this.playerSprite;
  };

  draw = () => {
    this.playerSprite.draw();
  };

  move = (direction) => {
    if(!this.playerSprite) {
      return; // In case not setup() yet
    }

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

  update = (specialTime) => {
    //let player‘s movement range not exceed the road
    let minRoadX = gameManager.getRoadXRange()[0] + this.playerWidth / 2;
    let maxRoadX = gameManager.getRoadXRange()[1] - this.playerWidth / 2;
    if (this.playerSprite.position.x < minRoadX) {
      sparkController.createSpark(gameManager.getRoadXRange()[0], this.playerSprite.position.y);
      this.playerSprite.position.x = minRoadX;
      this.playerSprite.velocity.x = 0;
    } else if (!specialTime && this.playerSprite.position.x > maxRoadX) {
      // 在買飲料事件進行時，讓玩家可以開到人行道上(因為停車格在人行道上)
      // specialTime = true -> 買飲料事件進行中
      sparkController.createSpark(gameManager.getRoadXRange()[1], this.playerSprite.position.y);
      this.playerSprite.position.x = maxRoadX;
      this.playerSprite.velocity.x = 0;
    }

    // 檢查玩家是否超過我們整條道路的上下範圍    
    let [screenTopY, screenBottomY] = gameManager.getVisibleYRange();
    let [minY, maxY] = gameManager.getGameYRange();    // For debug: minY = -33727,  maxY 830
    if(screenBottomY + this.playerSprite.velocity.y >= maxY) {
      // console.log("玩家移動不能超過底部");
      this.playerSprite.velocity.y = Math.min(this.playerSprite.velocity.y, 0);
    } else if(screenTopY + this.playerSprite.velocity.y <= minY) {
      // console.log("玩家移動不能超出最上邊界")
      if( (this.playerSprite.position.y+ this.playerSprite.velocity.y - this.playerHeight / 2) <= minY) {
        this.playerSprite.velocity.y = Math.max(this.playerSprite.velocity.y, 0);
      }
    }

    // 玩家開在路中間跳出提醒
    if(this.playerSprite.velocity.x == 0 && this.playerSprite.position.x >= width / 2 - 20 && this.playerSprite.position.x <= width / 2 + 20) {
      mainUIController.showAlertImg();
    } else {
      mainUIController.closeAlertImg();
    }

    if(gameManager.canPlayerSeeTopMost(this.playerSprite.velocity.y)) {
      // 在最頂部時，解除鏡頭跟隨玩家
      if(gameManager.isCameraFollowPlayer) {
        gameManager.setCameraFollowPlayer(false);
        camera.y = (minY + height/2);
      }
    }

    if(!gameManager.isCameraFollowPlayer && !gameManager.isEnded()) {
      // 當玩家離開最頂部區域時，恢復鏡頭跟隨
      if((this.playerSprite.position.y  + this.playerSprite.velocity.y >= minY + height/2 - gameManager.cameraYOffest)){
        gameManager.setCameraFollowPlayer(true);
      }
    }

  };
}
