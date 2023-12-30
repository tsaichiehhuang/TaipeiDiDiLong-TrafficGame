class EndingUIController {
    constructor() {
    }

    preload = () => {
        this._backgroundImage = loadImage('images/ending/end_bg.png');
        this._replayButtonImageDefault = loadImage('images/ending/end_button_default.png');
        this._replayButtonImagePressed = loadImage('images/ending/end_button_pressed.png');
    }

    setup = () => {
        let buttonOnClick = () => { 
            window.location.href = 'index.html';
        }

        let buttonTopY = 448;
        this._button = new Button(width/2, buttonTopY + this._replayButtonImageDefault.height/2,
            this._replayButtonImageDefault, this._replayButtonImagePressed, buttonOnClick);
    }

    show = (score, tickets) => {
        push();
        background(this._backgroundImage);

        this._button.display();

        // // 底色
        // noStroke();
        // rectMode(CENTER);
        // fill(246, 247, 251);
        // let radius = 40; // 圓角
        // rect(width/2, height/2, width * 0.7, height * 0.7, radius, radius, radius, radius);
        // // 字色
        // fill(60);
        // this._showTexts([`分數: ${score}`, this._generateTextByScore(score), this._genereateTicketText(tickets)]);
        // pop();
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

    /**
     * 根據分數，顯示不同的文字評語
     */
    _generateTextByScore = (score) => {

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