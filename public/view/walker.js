class Walker {
	constructor() {
		this.walkerSpeed = 3;
		this.isMoving = false;
		this.speedX = 0;
		this.sayingTime = 2000;
		this.textOffsetY = 80;
		this.rotateDir = 5;
		this.swayInterval = 30;
	}

	setup(startX, startY, endX, img, startMoving = false) {
		this.endX = endX;
		this.dir = (endX - startX > 0) ? 1 : -1; // 右正左負
		this.speedX = this.walkerSpeed * this.dir;

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
		this.sprite.rotateTo(this.rotateDir);
		if (frameCount % this.swayInterval == 0) {
			this.rotateDir *= -1;
		}
	}

	setIsMoving(isMoving) {
		this.isMoving = isMoving;
		this._updateSpeed();
	}

	_isWalkingToEndPos() {
		return (this.dir > 0 && this.sprite.position.x >= this.endX) ||
			(this.dir < 0 && this.sprite.position.x <= this.endX);
	}

	_updateSpeed() {
		if (this.isMoving) {
			this.sprite.vel.x = this.speedX;
		} else {
			this.sprite.vel.x = 0;
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