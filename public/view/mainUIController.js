class MainUIController {
	constructor() {
		this.taskText = '';
		this.score = 0;
		this.alertText = '';
		this.showAlertFlag = false;
	}

	preload = () => {
	}

	setup = () => {
		textAlign(LEFT, TOP);
		textSize(20);
		fill(255);
	}

	update = () => {
		this._drawTaskText();
		this._drawScore();
		if (this.showAlertFlag) {
			this._drawAlert();
		}
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
}
