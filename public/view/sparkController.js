class SparkController {
    constructor() {
        this.sparkSeconds = 0.5;
	}

    preload () {
        this.img = loadImage("../images/other/Crash.gif");
    }
    
    setup () {
        this.sparkGroup = new Group();
        this.sparkGroup.autoDraw = false;
    }

    /**
     * Create a spark, its top-left is at (x, y) position
     * It will show for a while and then disappear
     */
    createSpark (x, y) {
        let sprite = new this.sparkGroup.Sprite(x, y, 'n');
        sprite.img = this.img;
        sprite.scale = 0.3;
        
        // Convert from center to top-left
        sprite.x -= sprite.width / 2;
        sprite.y -= sprite.height / 2;
        sprite.offset.x += 10; // 因為圖有點偏左，所以往右調整一點
        sprite.debug = true;
        sprite.life = frameRate() * this.sparkSeconds;
    }

    drawExistingSparks () {
        this.sparkGroup.draw();
    }
}