function preloadCarImages() {
	const carImages = [];
	for (let i = 1; i <= 6; i++) {
		carImages.push(loadImage(`../images/objects/car/Car_${i}.png`));
	}
	return carImages;
}

// A demo of car
// If collision happens, the player will lose 1 score
class Car {
	/**
	 * @param {number} carType 車子圖片的編號(1~6)，不提供的話會隨機選一個
	 */
	constructor(carType = null) {
		this.carSpeed = -0.5;
        this.collided = false;
		this.acc = 0.125;
		this.colliderOffset = -25;
		
		if(carType === null) {
			this.carType = Math.floor(Math.random() * 6) + 1;
		}
	}
	
	preload() {
		//load explode image
		this.explosion = loadImage("../images/explosion.png");
	}

	setup(startY = - 50) {
		let car = new Sprite(width/2, startY);
		car.img = carImages[this.carType - 1];
		car.w += this.colliderOffset;
		car.h += this.colliderOffset;
		car.vel.y = this.carSpeed;
		car.debug = true; // TODO: remove this debug feature
		car.mass = 15;
		car.rotationLock = true; // 車被撞之後旋轉有點怪
		this.carSprite = car;
	}

	update() {
		this.carSprite.position.y += this.carSprite.vel.y;

		if(this.collided) {
			// update speed by accerlation
			this.carSprite.vel.y = min(0, this.carSprite.vel.y + this.acc);
			this.carSprite.vel.x = min(0, this.carSprite.vel.x + this.acc);
		}

        if(this.carSprite.collide(playerController.getPlayer())) {
			playerData.addScore(-1);

			this.collided = true;

			// 因為玩家的形狀後來不是正方形，所以放煙火的位置改到兩者碰撞點
			let collidedPoint = getCollidedPlayerPoint(this.carSprite);
			let effectSize = 100;

			//if the car collides with player, show explosion iamge
			image(this.explosion, collidedPoint.x - effectSize / 2, collidedPoint.y - effectSize / 2, effectSize, effectSize);
		} 
	}
}
