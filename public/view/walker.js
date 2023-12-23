class Walker {
	constructor(startPosY = 250) {
		this.walkerSpeed = 3;
		this.walkerWidth = 30;
		this.walkerHeight = 30;
		this.walkerSprites = [];
		this.roadMinX = 0;
		this.roadMaxX = 0;
		this.startPosY = startPosY;
	}

	setup(roadBounds) {
		this.roadMinX = roadBounds[0];
		this.roadMaxX = roadBounds[1];

		let walker = createSprite(this.roadMinX, this.startPosY, this.walkerWidth, this.walkerHeight);
		walker.color = color(255, 0, 0);
		walker.velocity.x = this.walkerSpeed;
		this.walkerSprites.push(walker);
	}

	update() {
		for (let i = 0; i < this.walkerSprites.length; i++) {
			if (this.walkerSprites[i].position.x > this.roadMaxX) {
				this.walkerSprites[i].position.x = this.roadMinX;
			}
		}
	}
}