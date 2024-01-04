function preloadScooterImages() {
	const scooterImages = [];
	for (let i = 1; i <= 2; i++) {
		scooterImages.push(loadImage(`images/objects/scooter/Scooter_${i}.png`));
	}
	return scooterImages;
}

class Scooter {
	/**
	 * @param {number} type 車子圖片的編號(1~2)，不提供的話會隨機選一個
	 */
	constructor(type = null) {
		this.carSpeed = -2;
        this.collided = false;
		this.acc = 0.125;
		this.colliderOffset = -20;
		
		if(type === null) {
			this.carType = Math.floor(Math.random() * 2) + 1;
		}
	}

	setup(startX = width/2, startY = height/4) {
		let car = new Sprite(startX, startY);
		car.img = scooterImages[this.carType - 1];


		car.w += this.colliderOffset;
		car.h += this.colliderOffset;
		car.vel.y = this.carSpeed;
		car.debug = true; // TODO: remove this debug feature
		car.autoDraw = false;
		allSprites.remove(car);
		car.removeColliders();
		car.addCollider(0, 0, 30, 170); // 比較長型的
		car.addCollider(0, -30, 80, 55); // 比較寬的
		car.mass = 5;
		car.rotationLock = true; // 車被撞之後旋轉有點怪

        showSparkWhenCollidePlayer(car, sparkController);
		this.carSprite = car;
	}

	update() {
		this.carSprite.position.y += this.carSprite.vel.y;

		if(this.collided) {
			// update speed by accerlation
			this.carSprite.vel.y = min(0, this.carSprite.vel.y + this.acc);
			this.carSprite.vel.x = min(0, this.carSprite.vel.x + this.acc);
		}

		this.carSprite.draw();
		
        if(this.carSprite.collide(playerController.getPlayer())) {
			playerData.addScore(-1);
			this.collided = true;
		} 
	}
}
