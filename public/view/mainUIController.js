let textVar = 'testMepipu';
class MainUIController {
	constructor() {
		this.taskText = '';
		this.score = 0;
		this.alertText = '';
		this.showAlertFlag = false;
		this.pointerImage = null;
		
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
		textAlign(LEFT, TOP);
		textSize(20);
		fill(255);

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

	update = () => {
		if(gameManager.isEnded()) {
			return;
		}
		push();
		
		this._drawTaskText();
		this._drawScore();
		if (this.showAlertFlag) {
			this._drawAlert();
		}
		this._drawSpeed();
		this.circle.draw();	
		this.flipper.draw(); // 指針
		this._drawArrowKeys();
		// console.log(this.arrowKeyIsDown);
		pop();
	}

	setTaskText = (text) => {
		this.taskText = `${text}\n這裡放任務`;
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
		text(`Score: ${this.score}`, width - 150, 20);
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
