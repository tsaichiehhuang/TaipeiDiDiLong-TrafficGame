class EndingUIController {
    constructor() {
        this.state = 0; // 0: 分數結算, 1: 封底
    }

    preload = () => {
        this._backgroundImage = loadImage('images/ending/end_bg.png');
        this._replayButtonImageDefault = loadImage('images/ending/end_button_default.png');
        this._replayButtonImagePressed = loadImage('images/ending/end_button_pressed.png');
        this._endingsImgs = [
            loadImage('images/ending/Ending3.png'),
            loadImage('images/ending/Ending2.png'),
            loadImage('images/ending/Ending1.png'),
        ]
    }

    setup = () => {
        let buttonOnClick = () => { 
            window.location.href = 'index.html';
        }

        let buttonTopY = 448;
        this._button = new Button(width/2, buttonTopY + this._replayButtonImageDefault.height/2,
            this._replayButtonImageDefault, this._replayButtonImagePressed, buttonOnClick);
    }

    _scoreSize = (score) => {
        switch(score.toString().length) {
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

    show = (score, tickets) => {
        push();
        
        if(this.state == 0) {
            background(this._bgByScore(score));
            fill(255);
            textFont('Comic Sans MS');
            textSize(this._scoreSize(score));
            text(score, 810, 290);

            let continueText = "(任意處點擊後繼續)"
            fill(200);
            textSize(16);
            text(continueText, width/2 - textWidth(continueText)/2, height - 70);
            
            if(mouseIsPressed) {
                this.state = 1;
            }
        } else {
            background(this._backgroundImage);
            this._button.display();
        }
    }


    _showTexts = (texts, yOffset = 200) => {
        texts.forEach((t, index) => {
            text(t, width / 2 - 200, yOffset + index * 50);
        });
    }

    _genereateTicketText = (tickets) => {
        let text = '';
        let sum = 0;
        tickets.forEach((t) => {
            text += `${t.title} ${t.amount} 元\n`;
            sum += t.amount;
        });
        text += `罰單總計 ${sum} 元`;
        return text;
    }

    _bgByScore = (score) => {
        score -= playerData.initScore; // TODO: 最後檢查分數條件
        if (score <= 4) {
            return this._endingsImgs[0];
        }
        if (score <= 9) {
            return this._endingsImgs[1];
        }
        return this._endingsImgs[2];
    }

    /**
     * 目前沒使用，直接用圖
     * 根據分數，顯示不同的文字評語
     */
    _generateTextByScore = (score) => {
        score -= playerData.initScore; // TODO: 最後檢查分數條件
        if (score <= 4) {
            return `你很有三寶潛力，還是不要上路比較好^_^`;
        }
        if (score <= 9) {
            return `再多注意一些細節，才能快樂出門、平安回家喔！`;
        }
        return `你是遵守交通規則的超讚安全駕駛！`;
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
            if(mouseIsPressed) {
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