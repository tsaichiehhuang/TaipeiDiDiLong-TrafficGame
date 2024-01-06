class OpeningUIController  {
    constructor() {
        this.IMG_Count = 7;
        this.x = 1020;
        this.y = 620;
        this.w = 180;
        this.h = 40;
        this.currentImg = 0;
        this.openingImgs = [];
        this.buttonSound;
        this.bgm;
    }

    preload() {
        for (let i = 1; i <= this.IMG_Count; i++) {
            this.openingImgs.push(loadImage(`../images/opening/${i}.png`));
        }
        this.buttonSound = loadSound("../audio/按鈕.mp3");
        this.buttonSound.setVolume(0.5);
        this.bgm = loadSound("../audio/開頭.mp3");
        this.bgm.setVolume(0.5);
    }

    draw() {
        // rect(1020, 620, 180, 40); // Button position
        if (mouseX < this.x || mouseX > this.x + this.w || mouseY < this.y || mouseY > this.y + this.h) {
            cursor(ARROW);
        } else {
            cursor(HAND);
        }
        background(this.openingImgs[this.currentImg]);
    }

    onMousePressed() {
        if(!this.bgm.isPlaying()) {
            this.bgm.play();
        }
        
        // Check if mouse is pressed on button
        if (mouseX < this.x || mouseX > this.x + this.w || mouseY < this.y || mouseY > this.y + this.h) {
            return;
        }
        this.next();
    }

    next() {
        this.buttonSound.play();
        this.currentImg++;
        if (this.currentImg >= this.IMG_Count) {
            window.location.href = "game.html";
        }
    }
}