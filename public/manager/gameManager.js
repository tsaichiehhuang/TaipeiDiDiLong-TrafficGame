const GAME_WIDTH = 1280;
const GAME_HEIGHT = 720;

// Control the background and section
class GameManager {
	constructor() {
		this._roadSprites = [];
		this._roadImage = null;
		this._streetImage = null;
		this._streetSprites = [];
		this._roadHeight = 600; // road image height
		this._section = 1; // 1-based, from 1 ~ 5
		this._sectionChangedCallbacks = [];

		// For nextSectionAfterScreenHeight()
		// 紀錄玩家一開始的位置
		this._nextSectionStartY = 0;
		// 是否有在等待進入下一個 section
		this._isCheckingNextSectionDistance = false;
		// 要走幾個螢幕高度後，才會進入下一個 section
		this._nextSectionHeightCount = 3;

	}

	preload = () => {
		// 馬路
		this._roadImage = loadImage("images/road/road_bg.png");
		// 馬路 + 人行道
		this._streetImage = loadImage("images/road/street_bg.png");

		this._backgroundImage = loadImage("images/start.gif");
	};

	setup = () => {
		createCanvas(GAME_WIDTH, GAME_HEIGHT);

		// Make multiple roads, so they can look like scrolling
		for (let i = 0; i < 3; i++) {
			let yPos = i * this._roadHeight;
			let sprite = createSprite(width / 2, yPos);
			sprite.addImage(this._roadImage);
			sprite.collider = 'n'; //none
			this._roadSprites.push(sprite);

			let streetSprite = createSprite(width / 2, yPos);
			streetSprite.addImage(this._streetImage);
			streetSprite.collider = 'n'; //none
			this._streetSprites.push(streetSprite);
		}
	};

	update = () => {
		/* 顯示背景 */
		background(this._backgroundImage);
		this._repositionRoadsIfNeed();

		if(this._isCheckingNextSectionDistance) {
			this._checkIfShouldNextSection();
		}
	};

	getSection = () => {
		return this._section;
	};

	setSection = (newSection) => {
		const oldSection = this._section;
		this._section = newSection;

		this._sectionChangedCallbacks.forEach((callback) => {
			callback(oldSection, newSection);
		})
	};

    // Method to register callbacks for section change
    addSectionChangedCallback = (callback) => {
        this._sectionChangedCallbacks.push(callback);
    };

	/**
	 * Set camera follow on player position
	 * @param {p5.vector} followPoint 
	 */
	cameraFollow = (followPoint) => {
		// Set camera follow player on y axis
		let offsetY = -200;
		camera.y = followPoint.y + offsetY;
	}
	
	/**
	 * 取得只有馬路的 (minX, maxX)
	 * @returns {number[]} [leftBound, rightBound]
	 */
	getRoadXRange = () => {
		return [
			this._roadSprites[0].position.x - this._roadSprites[0].width / 2,
			this._roadSprites[0].position.x + this._roadSprites[0].width / 2,
		];
	}

	/**
	 * 取得馬路 + 人行道的 (minX, maxX)
	 * @returns {number[]} [leftBound, rightBound]
	 */
	getStreetXRange = () => {
		return [
			this._streetSprites[0].position.x - this._streetSprites[0].width / 2,
			this._streetSprites[0].position.x + this._streetSprites[0].width / 2,
		];
	}

	/**
	 * Based on camera current position, return the visible y range of the screen
	 * @returns {number[]} [minY, maxY]
	 */
	getVisibleYRange = () => {
		return [
			camera.position.y - height / 2,
			camera.position.y + height / 2
		]
	}

	/**
	 *  要切換到下一個 section 時呼叫此 function，
	 *  會等玩家走了 n 個螢幕高度後，自動切換到下一個 section
	 *  
	 * Example:
	 *  	// 在一個段落的所有的事件完成後
	 *  	gameManager.nextSectionAfterScreenHeight();
	 * 
	 * @param {*} screenHeightCount 要往上走幾個螢幕高度後，才會進入下一個 section
	 */
	nextSectionAfterScreenHeight = (screenHeightCount = 3) => {
		if(this._isCheckingNextSectionDistance) {
			console.log("[WARN] 已經在等待進入下一個 section 了!")
			return;
		}
		this._nextSectionHeightCount = screenHeightCount;
		this._nextSectionStartY = playerController.getPlayer().position.y;
		this._isCheckingNextSectionDistance = true;
	}

	/**
	 * @returns {boolean} true if the game is ended
	 */
	isEnded = () => {
		return this._section === 6;
	}

	_checkIfShouldNextSection = () => {
		// 如果玩家已經走了 n 個螢幕高度
		if(playerController.getPlayer().position.y <= this._nextSectionStartY - height * this._nextSectionHeightCount) {
			this.setSection(this._section + 1);
			this._isCheckingNextSectionDistance = false;
		}
	}

	// Check if the road needs to be repositioned based on scroll direction
	_repositionRoadsIfNeed = () => {
		let player = playerController.getPlayer();
		let [minY, maxY] = this.getVisibleYRange();
		this._roadSprites.forEach((roadSprite, i) => {
			let halfRoadHeight = this._roadHeight / 2;

			if (player.vel.y < 0) {
				let isOutOfBottomScreen =
					roadSprite.position.y > maxY + halfRoadHeight;
				if (isOutOfBottomScreen) {
					let nextIndex = (i + 1) % this._roadSprites.length;
					roadSprite.position.y =
						this._roadSprites[nextIndex].position.y - this._roadHeight;
					this._streetSprites[i].position.y = 
						this._streetSprites[nextIndex].position.y - this._roadHeight;
				}
			} else if (player.vel.y > 0) {
				let isOutOfTopScreen = roadSprite.position.y < minY - halfRoadHeight;
				if (isOutOfTopScreen) {
					let prevIndex =
						(i - 1 + this._roadSprites.length) % this._roadSprites.length;
					roadSprite.position.y =
						this._roadSprites[prevIndex].position.y + this._roadHeight;
					this._streetSprites[i].position.y = 
						this._streetSprites[prevIndex].position.y + this._roadHeight;
				}
			}
		});
	};
}
