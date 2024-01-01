/**
 * Control the movement and sprite of the player
 */
class PlayerController {

	constructor() {
		this.playerSpeed = 5;
		this.playerImg = null;
		this.playerSizeOffset = -20; // 讓 player 的範圍較小一點，去掉透明的區域
	}
	
	preload = () =>{
		this.playerImg = loadImage("images/player/player.png");
		//load explode image
		this.explosion = loadImage("../images/explosion.png");
	};

	setup = () => {
		this.playerWidth = this.playerImg.width + this.playerSizeOffset;
		this.playerHeight = this.playerImg.height + this.playerSizeOffset;

		this.playerSprite = new Sprite(width / 2, height - 50, this.playerWidth, this.playerHeight);
		this.playerSprite.img = this.playerImg;
		
		this.playerSprite.removeColliders();
		this.playerSprite.addCollider(0, 0, 35, 225) // 比較長型的
		this.playerSprite.addCollider(0, -30, 100, 80) // 比較寬的
		this.playerSprite.mass = 5; // 大概是車子的 1/3
	
		// From p5play doc:
		// 'kinematic' colliders can be moved programmatically but not by other sprites. 
		// They also won't collide with other kinematic colliders.
		// this.playerSprite.collider = 'k';
		
		// 一開始是 collider = kinematic，但會讓 player 無法與其他 collider （車子）自然地碰撞
		// rotationLock = true 可以讓 player 不會因碰撞就旋轉
		this.playerSprite.rotationLock = true;

		// 為了讓玩家的 sprite 在最上面
		this.playerSprite.autoDraw = false;

		// 如果沒 remove 的話， allSprites.draw() 會再畫第二次 player
		allSprites.remove(this.playerSprite);

		// Debug 用，可以看到 player 的 collider
		this.playerSprite.debug = true;
	};

	getPlayer = () => {
		return this.playerSprite;
	};

	draw = () => {
		this.playerSprite.draw();
	};

	move = (direction) => {
		// Demo
		if (direction === 'up') {
			this.playerSprite.velocity.y = -this.playerSpeed;
		} else if (direction === 'down') {
			this.playerSprite.velocity.y = this.playerSpeed;
		} else if (direction === 'left') {
			this.playerSprite.velocity.x = -this.playerSpeed;
		} else if (direction === 'right') {
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
		if(this.playerSprite.position.x < minRoadX) {
			image(this.explosion, gameManager.getRoadXRange()[0] - this.playerWidth, this.playerSprite.position.y - this.playerHeight , 100, 100);
			this.playerSprite.position.x = minRoadX;
			this.playerSprite.velocity.x = 0;
		} else if(this.playerSprite.position.x > maxRoadX) {
			image(this.explosion, gameManager.getRoadXRange()[1] - this.playerWidth, this.playerSprite.position.y - this.playerHeight , 100, 100);
			this.playerSprite.position.x = maxRoadX;
			this.playerSprite.velocity.x = 0;
		}
	}
}
