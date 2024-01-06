let textVar = 'testMepipu';
class MainUIController {
	constructor() {
		this.taskText = '';
		this.score = 0;
		this.alertText = '';
		this.showAlertFlag = false;
		this.pointerImage = null;
		this._isShowing = true;
		// up, down, left, right
		this.arrowKeyIsDown = [false, false, false, false];
	}

	preload = () => {
		this.pointerImage = loadImage('images/main_ui/speed_pointer.png');
		this.pointerCircleImg = loadImage('images/main_ui/Speed.png');

		// Arrows
		this.arrowDefaultImg = loadImage('images/other/Direction.png');
		this.arrowPressedImgs = [
			loadImage('images/other/Up.png'),
			loadImage('images/other/Down.png'),
			loadImage('images/other/Left.png'),
			loadImage('images/other/Right.png'),
		];
	}

	setup = () => {

		this.speedPos = createVector(width - 360, height - 55); // Figma 量的

		let circle = new Sprite(camera.x,  camera.y, 'n');
		circle.img = this.pointerCircleImg;
		this.circle = circle;
		allSprites.remove(circle);

		let flipper = new Sprite(this.speedPos.x, this.speedPos.y, 'n');
		flipper.img = this.pointerImage;		
		let pointerW =  flipper.img.width;

		flipper.offset.x = -(pointerW/2 - 5) ;
		this.flipper = flipper;

		allSprites.remove(flipper);

		this.arrowSprite = new Sprite(camera.x, camera.y, 'n');
		this.arrowSprite.img = this.arrowDefaultImg;
		this.arrowSprite.autoDraw = false;
		allSprites.remove(this.arrowSprite);

		this.arrowKeySprites = this.arrowPressedImgs.map((img) => {
			let sprite = new Sprite(camera.x, camera.y, 'n');
			sprite.img = img;
			sprite.autoDraw = false;
			allSprites.remove(sprite);
			return sprite;
		});
	}

	/**
	 * 設定字型與大小
	 */
	_applyText = () => {
		textSize(30);
		fill(255);
		stroke(82, 105, 90); //深綠色
		strokeWeight(2);
		textAlign(LEFT, TOP);
	}

	update = () => {
		if(gameManager.isEnded()) {
			return;
		}
		push();
		// 放在 push() 和 pop() 內好像能防止其他地方的字也被調整到
		this._applyText(); 
		
		this._drawTaskText();
		this._drawScore();
		if (this.showAlertFlag) {
			this._drawAlert();
		}
		
		if(this._isShowing) {
			this._drawSpeed();
			this.circle.draw();	
			this.flipper.draw(); // 指針
			this._drawArrowKeys();
		}
		pop();
	}

	/**
	 * 設定任務文字
	 * @param {*} text 要顯示在左上角的文字
	 */
	setTaskText = (text) => {
		this.taskText = text;
	}

	/**
	 * 是否顯示時速與方向鍵 UI
	 * @param {boolean} isShowing 
	 */
	setIsShowing = (isShowing) => {
		this._isShowing = isShowing;
	}

	setScore = (score) => {
		this.score = score;
	}

	showAlert = (text) => {
		this.alertText = text;
		this.showAlertFlag = true;
	}

	closeCurrentAlert = () => {
		this.showAlertFlag = false;
	}

	_drawTaskText = () => {
		text(this.taskText, 20, 20);
	}

	_drawScore = () => {
		text(`Score: ${this.score}`, width - 200, 20);
	}

	_drawAlert = () => {
		textSize(30);
		textAlign(CENTER, CENTER);
		text(this.alertText, width / 2, height / 2);
	}

	_drawSpeed = () => {
		// 依照速度畫出指針
		let angle = this._speedToAngle(player.vel);
		this.flipper.rotateTo(angle, 5);

		// 畫出時速
		// textSize(30);
		// textAlign(CENTER, CENTER);
		// strokeWeight(0);
		// 四捨五入速度
		// text(round(player.vel.mag()), this.speedPos.x, this.speedPos.y + 40);
	}

	_drawArrowKeys = () => {
		// 底圖
		this.arrowSprite.draw();
		// 根據按鈕狀態畫上下左右
		this.arrowKeySprites.forEach((sprite, i) => {
			if (this.arrowKeyIsDown[i]) {
				sprite.draw();
			}
		});
	}

	setArrowKeyIsDown = (keyCode, isDown) => {
		let keyCodes = [UP_ARROW, DOWN_ARROW, LEFT_ARROW, RIGHT_ARROW];
		if(keyCodes.indexOf(keyCode) === -1) {
			return;
		}
		this.arrowKeyIsDown[keyCodes.indexOf(keyCode)] = isDown;
	}

	_speedToAngle = (speed) => { 
		let minSpeed = 0;
		let maxSpeed = sqrt(50); // TODO: 配合玩家的速度上限調整, sqrt(5^2 + 5^2)
		let speedMag = speed.mag();
		return map(speedMag, minSpeed, maxSpeed, 0, 180);
	}
}
