// A demo of car
// If collision happens, the player will lose 1 score
class Car {
	constructor() {
		this.carSpeed = 2;
		this.carSize = 30;
		this.carSprite;
        this.collided = false;
		this.acc = 0.125;
	}

	setup() {
        let startY = -100;
		let car = createSprite(width/2, startY, this.carSize, this.carSize);
		car.color = color(0, 255, 0);
		car.vel.y = this.carSpeed;
		car.text = "對向車，撞到扣分";
		this.carSprite = car;
	}

	update() {

		this.carSprite.position.y += this.carSprite.vel.y;

		if(this.collided) {
			// update speed by accerlation
			this.carSprite.vel.y = min(0, this.carSprite.vel.y + this.acc);
			this.carSprite.vel.x = min(0, this.carSprite.vel.x + this.acc);
		}

        if(this.carSprite.collide(playerController.getPlayer()) && !this.collided) {
            playerData.addScore(-1);
            
			this.collided = true;
			this.carSprite.vel.x = -5;
			this.carSprite.vel.y = -3;
        } 
	}
}
