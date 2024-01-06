class EndingUIController {
    constructor() {
        this.state = -1; // -1: 到家了, 0: 分數結算, 1: 封底
        this.totalMoney = null;
    }

    /**
     * 0 :最差的結局
     * 1 :中等的結局
     * 2 :最好的結局
     */
    _decideEnding = (score) => {
        // 只計算玩家的得分，扣掉初始分數
        let added = score - playerData.initScore;
        if (added <= 40) {
            return 0;
        }
        if (added <= 90) {
            return 1;
        }
        return 2;
    }

    preload = () => {
        this._backgroundImage = loadImage('images/ending/end_bg.png');
        this._replayButtonImageDefault = loadImage('images/ending/end_button_default.png');
        this._replayButtonImagePressed = loadImage('images/ending/end_button_pressed.png');
        this._bestImage = loadImage('images/ending/Ending1.png');
        this._middleImage = loadImage('images/ending/Ending2.png');
        this._worstImage = loadImage('images/ending/Ending3.png');

        this._bestBgm = this._loadBgm('audio/結局(高).mp3');
        this._middleBgm = this._loadBgm('audio/結局(中).mp3');
        this._worstBgm = this._loadBgm('audio/結局(低).mp3');

        this._homeHappyImage = loadImage('images/other/Home.png');
    }

    _loadBgm = (file) => {
        let bgm = loadSound(file);
        bgm.setVolume(0.1);
        bgm.looping = true;
        return bgm;
    }

    _getBgmByEnding = (ending) => {
        switch (ending) {
            case 0:
                return this._worstBgm;
            case 1:
                return this._middleBgm;
            case 2:
                return this._bestBgm;
            default:
                console.warn("EndingUIController: _getBgmByEnding: ending not found");
                return this._worstBgm;
        }
    }

    setup = (score, tickets) => {
        this.score = score;
        this.tickets = tickets;
        this.ending = this._decideEnding(score);
        this.currentBgm = this._getBgmByEnding(this.ending);


        let buttonOnClick = () => {
            window.location.href = 'index.html';
        }

        let buttonTopY = 448;
        this._button = new Button(width / 2, buttonTopY + this._replayButtonImageDefault.height / 2,
            this._replayButtonImageDefault, this._replayButtonImagePressed, buttonOnClick);

        // For testing
        // playerData.addTrafficTicket("闖紅燈", 1800);
        // playerData.addTrafficTicket("闖紅燈", 1800);

        this.totalMoney = this._getTotalAmount(tickets);
    }

    _scoreSize = (score) => {
        switch (score.toString().length) {
            case 1:
                return 60;
            case 2:
                return 50;
            case 3:
                return 40;
            default: // 也太多
                return 30;
        }
    }

    _moneySize = (score) => {
        switch (score.toString().length) {
            case 1:
                return 40;
            case 2:
                return 60;
            case 3:
                return 50;
            case 4:
                return 40;
            case 5:
                return 30;
            default: // 也太多
                return 25;
        }
    }

    _showContinueText = () => {
        let continueText = "(ENTER 後繼續)"
        fill(200);
        textSize(16);
        text(continueText, width / 2 - textWidth(continueText) / 2, height - 70);
    }

    show = (score = this.score, tickets = this.tickets) => {

        push();
        if (this.state == -1) {
            // 到家了！
            background(this._homeHappyImage);
        }
        else if (this.state == 0) {

            if (!this.currentBgm.isPlaying()) {
                this.currentBgm.play();
            }


            background(this._bgByScore(score));

            // 畫分數
            fill(255);
            textSize(this._scoreSize(score));
            text(score, 790, 250);

            // 畫罰單總金額
            textSize(this._moneySize(this.totalMoney));
            text(this.totalMoney, 770 - textWidth(this.totalMoney) / 2, 350);

            let continueText = "(ENTER 後繼續)"
            fill(200);
            textSize(16);
            text(continueText, width / 2 - textWidth(continueText) / 2, height - 70);

            // // Debug 時用
            // if(mouseIsPressed) {
            //     if(!this.currentBgm.isPlaying()){ 
            //         this.currentBgm.play();
            //     }
            // }
        } else {
            background(this._backgroundImage);
            this._button.display();
        }
    }

    onKeyPressed = (keyCode) => {
        if (keyCode == ENTER && this.state <= 0) {
            allSounds.get("button").play();
            this.state += 1;
        }
    }

    _showTexts = (texts, yOffset = 200) => {
        texts.forEach((t, index) => {
            text(t, width / 2 - 200, yOffset + index * 50);
        });
    }

    _getTotalAmount = (tickets) => {
        let sum = 0;
        tickets.forEach((t) => {
            sum += t.amount;
        });
        return sum;
    }

    _bgByScore = () => {
        switch (this.ending) {
            case 0:
                return this._worstImage;
            case 1:
                return this._middleImage;
            case 2:
                return this._bestImage;
            default:
                console.warn("EndingUIController: _bgByScore: ending not found");
                return this._worstImage;
        }
    }
}

/**
 * From : https://editor.p5js.org/kjhollen/sketches/dHOoxK_hD
 */
class Button {

    /**
     * Position is based on CENTER
     */
    constructor(x, y, defaultImg, pressedImg, onClick) {
        this.x = x;
        this.y = y;
        this.img = defaultImg;
        this.imgPressed = pressedImg;
        this.onClick = onClick;
        this.clickOffset = 10; // 周圍有透明區域的 clicking area offset
    }

    display() {
        push();
        imageMode(CENTER);
        if (this.over()) {
            image(this.img, this.x, this.y);
            cursor(HAND);
            if (mouseIsPressed) {
                this.onClick();
            }
        } else {
            cursor(ARROW);
            image(this.imgPressed, this.x, this.y);
        }
        pop();
    }

    // over automatically matches the width & height of the image read from the file
    // see this.img.width and this.img.height below
    over() {
        let minX = this.x - this.img.width / 2 + this.clickOffset;
        let maxX = this.x + this.img.width / 2 - this.clickOffset;
        let minY = this.y - this.img.height / 2 + this.clickOffset;
        let maxY = this.y + this.img.height / 2 - this.clickOffset;
        if (mouseX >= minX && mouseX <= maxX && mouseY > minY && mouseY < maxY) {
            return true;
        } else {
            return false;
        }
    }
}