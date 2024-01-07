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
		this.carSpeed = -3;
		this.collided = false;
		this.acc = 0.125;
		this.colliderOffset = -20;
		this._spritesWillStop = []; // 前面偵測到的哪些 sprite 會讓車子停下來
		this.isChangingRoad = false;
		this._isRemoveingIfcan = false;

		if (type === null) {
			this.carType = Math.floor(Math.random() * 2) + 1;
		}
	}

	setup(startX = width / 2, startY = height / 4, speed = this.carSpeed) {
		this.carSpeed = speed;
		let car = new Sprite(startX, startY);
		car.img = scooterImages[this.carType - 1];

		car.w += this.colliderOffset;
		car.h += this.colliderOffset;
		car.vel.y = this.carSpeed;
		car.debug = gameManager.debugMode; // TODO: remove this debug feature
		car.autoDraw = false;
		allSprites.remove(car);
		car.removeColliders();
		car.addCollider(0, 0, 30, 170); // 比較長型的
		car.addCollider(0, -30, 80, 55); // 比較寬的
		car.mass = 5;
		car.rotationLock = true; // 車被撞之後旋轉有點怪

		let frontOffset = 150;

		// 在車子前面加一個 sensor，用來偵測前方有沒有需要停下來的物體
		//https://github.com/Tezumie/into-the-mines/blob/5839c139e52555353d180aa91d25f8bf9913ac2f/player.js#L295
		// car.frontSensor = new Sprite(width/2, startY - frontOffset, width/3, 100, 'n');
		car.frontSensor = new Sprite(width / 2, startY - frontOffset, 10, 10, 'n');
		car.frontSensor.debug = gameManager.debugMode;
		car.frontSensor.visible = true;
		let j = new GlueJoint(car, car.frontSensor);
		j.visible = false;

		let [left, right] = gameManager.getRoadCenterXs();
		let roadWidthHalf = right - left;

		// 偵測是否要換到另一條車道
		car.roadSensor = new Sprite(startX, startY - frontOffset, roadWidthHalf - 10, 100, 'n');
		car.roadSensor.debug = gameManager.debugMode;
		car.roadSensor.visible = true;
		j = new GlueJoint(car, car.roadSensor);
		j.visible = false;

		// car.leftSensor = new Sprite(left, startY - frontOffset, roadWidthHalf - 10, 100, 'n');
		// car.leftSensor.debug = gameManager.debugMode;
		// car.leftSensor.visible = true;
		// j = new GlueJoint(frontSensor, car.leftSensor);
		// j.visible = false;

		this.sprite = car;
		this.sprite.body.sprite = this.sprite;

		registerSparkWhenCollide(this.sprite, sparkController);
	}

	setIsMoving(isMoving) {
		if (isMoving) {
			this.sprite.vel.y = this.carSpeed;
		} else {
			this.sprite.vel.y = 0;
		}
	}

	_isNeedToStop() {
		for (let sprite of this._spritesWillStop) {
			if (this.sprite.frontSensor.overlapping(sprite)) {
				return true;
			}
		}
		return false;
	}

	onRoadSensorOverlapping = () => {
		if (this._isChangingRoad) return;
		this._isChangingRoad = true;
		this._targetRoad = (this.sprite.position.x < width / 2) ? "right" : "left";
	}

	setWillStopBefore(sprite) {
		this._spritesWillStop.push(sprite);
	}

	/**
	 * 設定監測到某個 sprite 時會換到另一條車道
	 * @param {} sprite 
	 */
	setWillChangeRoad(sprite) {
		this.sprite.roadSensor.overlapping(sprite, this.onRoadSensorOverlapping);
	}


	draw() {
		if (!this.sprite) return;
		if (this._isRemoveingIfcan) {
			let [topY, bottomY] = gameManager.getVisibleYRange();
			if (this.sprite.position.y - this.sprite.height < topY ||
				this.sprite.position.y + this.sprite.height > bottomY
			) {
				console.log("remove sprite out of screen");
				this.removeSprite();
				return;
			}
		}


		this.sprite.draw();

		if (this.collided && abs(this.sprite.vel.y) > 0 && abs(this.sprite.vel.x) > 0) {
			// update speed by accerlation
			this.sprite.vel.y = min(0, this.sprite.vel.y + this.acc);
			this.sprite.vel.x = min(0, this.sprite.vel.x + this.acc);
			return;
		}

		if (this._isNeedToStop()) {
			this.setIsMoving(false);
		} else {
			this.setIsMoving(true);
		}

		if (this._isChangingRoad) {
			if (this._targetRoad == "right") {
				this.sprite.moveTowards(gameManager.getRoadCenterXs()[1], this.sprite.position.y, 2 / frameRate());
				if (this.sprite.position.x >= gameManager.getRoadCenterXs()[1] - 20) {
					this._isChangingRoad = false;
					this.sprite.vel.x = 0;
					this.setIsMoving(true);
				}
			} else {
				this.sprite.moveTowards(gameManager.getRoadCenterXs()[0], this.sprite.position.y, 2 / frameRate());
				if (this.sprite.position.x <= gameManager.getRoadCenterXs()[0] + 20) {
					this._isChangingRoad = false;
					this.sprite.vel.x = 0;
					this.setIsMoving(true);
				}
			}
		}

		if (this.sprite.collide(playerController.getPlayer())) {
			playerData.addScore(-10);
			allSounds.get("wrong").play();
			this.collided = true;
		}
	}

	removeSprite = () => {
		if (!this.sprite) return;
		this.sprite.frontSensor.remove();
		this.sprite.roadSensor.remove();
		this.sprite.remove();
		this.sprite = null;
	}

	removeOutOfScreen() {
		this._isRemoveingIfcan = true;
	}

	/**
	 * 更新速度
	 */
	updateSpeed(speed) {
		if (speed >= 0) return; // 只能往前
		this.carSpeed = speed;
	}
}