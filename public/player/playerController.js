/**
 * Control the movement and sprite of the player
 */
class PlayerController {

	constructor() {
		this.playerWidth = 50
		this.playerHeight = 50;
		this.playerSpeed = 5;
		this.playerSprite = null;
	}

	setup = () => {
		this.playerSprite = createSprite(width / 2, height - 50, this.playerWidth, this.playerHeight);
		this.playerSprite.color = color(0, 150, 255);
		
		// From p5play doc:
		// 'kinematic' colliders can be moved programmatically but not by other sprites. 
		// They also won't collide with other kinematic colliders.
		this.playerSprite.collider = 'k';
	};

	getPlayer = () => {
		return this.playerSprite;
	};

	move = (direction) => {
		// Demo
		if (direction === 'up') {
			this.playerSprite.velocity.y = -this.playerSpeed;
		} else if (direction === 'down') {
			this.playerSprite.velocity.y = this.playerSpeed;
		} else {
			this.playerSprite.velocity.y = 0;
		}
	};
}
