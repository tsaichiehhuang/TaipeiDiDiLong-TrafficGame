class RunningRedLightCar {
	constructor() {
		this.walkerSpeed = 8;
		this.isMoving = false;
		this.speedY = 0;
		this.sayingTime = 2000;
		this.textOffsetY = 80;
		this.rotateDir = 5;
		this.swayInterval = 30;
	}

	setup(startX, startY, endY, img, startMoving = false) {
		this.endY = endY;
		this.dir = (endY - startY > 0) ? 1 : -1; // 上正下負
		this.speedY = this.walkerSpeed * this.dir;

		let sprite = new Sprite(startX, startY);
		sprite.img = img;
		sprite.debug = gameManager.debugMode;

		sprite.autoDraw = false;
		allSprites.remove(sprite);

		sprite.mass = 1;
		registerSparkWhenCollide(sprite, sparkController);
		this.sprite = sprite;

		this.lastShowTextTime = millis();

		// 是否要立刻走
		this.isMoving = startMoving;
		this.setIsMoving(this.isMoving);
		registerSparkWhenCollide(this.sprite, sparkController);
	}

	_drawText() {
		if (this.text == "") return;
		push();
		textSize(24);
		fill(255);
        text(this.text, this.sprite.position.x - textWidth(this.text) / 2, this.sprite.position.y - this.textOffsetY);
		pop();
	}

	draw() {
		if (!this.sprite) {
			return; // In case 還沒 setup
		}

		// 走到底就停下
		if (this.isMoving && this._isWalkingToEndPos()) {
			this.sprite.vel.x = 0;
		}

		if (!this.collided) {
			if (this.sprite.vel.x != 0) {
				this._sway();
			} else {
				this.sprite.rotateTo(0);
			}
		}

		this.checkCollison();
		this.sprite.draw();
		this._drawText()
		this._resetTextIfNeed();
	}

	_resetTextIfNeed() {
		// 如果超過顯示文字的的時間
		if (this.text != "" && millis() - this.lastShowTextTime > this.sayingTime) {
			this.text = "";
		}
	}

	_sway() {
		this.sprite.rotateTo(0);
	}

	setIsMoving(isMoving) {
		this.isMoving = isMoving;
		this._updateSpeed();
	}

	_isWalkingToEndPos() {
		return (this.dir > 0 && this.sprite.position.y >= this.endY) ||
			(this.dir < 0 && this.sprite.position.y <= this.endY);
	}

	_updateSpeed() {
		if (this.isMoving) {
			this.sprite.vel.y = this.speedY;
		} else {
			this.sprite.vel.y = 0;
		}
	}

	say(text) {
		this.text = text;
		this.lastShowTextTime = millis();
	}

	setCollidePlayerCallback(callback) {
		this.collidePlayerCallback = callback;
	}

	checkCollison() {
		//check if the walker collides with player
		if (!this.collided && this.sprite.collide(playerController.getPlayer())) {
			this.sprite.vel.x = 0;
			playerData.addScore(-100);
			this.collided = true;
			this.say("啊～");
			if (this.collidePlayerCallback) {
				this.collidePlayerCallback();
			}
		}
	}
}