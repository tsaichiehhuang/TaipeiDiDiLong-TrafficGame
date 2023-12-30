let textVar = 'testMepipu';
class MainUIController {
	constructor() {
		this.taskText = '';
		this.score = 0;
		this.alertText = '';
		this.showAlertFlag = false;
		this.pointerImage = null;
	}

	preload = () => {
		this.pointerImage = loadImage('images/main_ui/speed_pointer.png');
	}

	setup = () => {
		textAlign(LEFT, TOP);
		textSize(20);
		fill(255);

		this.speedPos = createVector(width - 110, height - 100);
		this.speedColor = color(214, 76, 76);
		this.speedSize = 150 // 儀表板大小
		this.speedWeight = 15; // 儀表板外匡粗細

		let pointerW =  75;
		let pointerH =  20;
		let flipper = new Sprite(this.speedPos.x, this.speedPos.y, pointerW, pointerH, 'n');
		flipper.img = this.pointerImage;
		flipper.offset.x = -pointerW/2;
		this.flipper = flipper;

		allSprites.remove(flipper); // TODO
	}

	update = () => {
		push();
		this._drawTaskText();
		this._drawScore();
		if (this.showAlertFlag) {
			this._drawAlert();
		}
		this._drawSpeed();
		this.flipper.draw();	
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
		// 畫出圓形外框
		stroke(this.speedColor);
		strokeWeight(this.speedWeight);
		noFill();
		let offsetAngle = 15;
		arc(this.speedPos.x, this.speedPos.y, this.speedSize, this.speedSize, 180 - offsetAngle, 360 + offsetAngle);

		// 依照速度畫出指針
		let angle = this._speedToAngle(player.vel);
		this.flipper.rotateTo(angle, 5);
	}

	_speedToAngle = (speed) => { 
		let minSpeed = 0;
		let maxSpeed = 5; // TODO: 配合玩家的速度上限調整
		let speedMag = speed.mag();
		return map(speedMag, minSpeed, maxSpeed, 0, 180);
	}
}
