const GAME_WIDTH = 1280;
const GAME_HEIGHT = 720;

// Control the background and section
class GameManager {
	constructor() {
		this.cameraYOffest = -200;
		this._roadSprites = [];
		this._roadImage = null;
		this._bgSprites = []; // 最外層的背景

		// 720 會有一點很小的縫縫
		this._roadHeight = 719; // road image height
		this._section = 1; // 1-based, from 1 ~ 5
		this._sectionChangedCallbacks = [];

		// For nextSectionAfterScreenHeight()
		// 紀錄玩家一開始的位置
		this._nextSectionStartY = 0;
		// 是否有在等待進入下一個 section
		this._isCheckingNextSectionDistance = false;
		// 要走幾個螢幕高度後，才會進入下一個 section
		this._nextSectionHeightCount = 3;

		this.isCameraFollowPlayer = true;
	}

	preload = () => {
		// 背景（綠色草部分）
		this._bgImages = [
			loadImage("images/road/background/Road1.png"),
			loadImage("images/road/background/Road2.png"),
			loadImage("images/road/background/Road3.png"),
			loadImage("images/road/background/Road4.png"),
		];

		// 馬路
		this._roadImages = [
			loadImage("images/road/Road_1.png"),
			loadImage("images/road/Road_2.png"),
		]

		this._backgroundImage = loadImage("images/start.gif");
	};

	setup = () => {
		createCanvas(GAME_WIDTH, GAME_HEIGHT);

		let group = new Group();

		// Make background
		let yPos =  (-this._bgImages[0].height - this.cameraYOffest) / 2  + height + 10;
		for(let i = 0; i < this._bgImages.length; i++) {
			this._createRoadSprite(group, width / 2, yPos, this._bgImages[i], this._bgSprites);
			yPos -= (this._bgImages[i].height - 1); // 不減 1 會有一點點ㄉ縫縫
		}

		// Make multiple roads, so they can look like scrolling
		for (let i = 0; i < 4; i++) {
			let yPos = i * this._roadHeight;
			let imageIndx = i % this._roadImages.length;
			this._createRoadSprite(group, width / 2, yPos, this._roadImages[imageIndx], this._roadSprites);
		}

		this._backgroundGroup = group;
	};

	_createRoadSprite = (group, x, y, img, array) => {
		let sprite = new group.Sprite(x, y);
		sprite.addImage(img);
		sprite.collider = 'n'; //none

		sprite.autoDraw = false; // 自己決定什麼時候畫，不要自動畫
		allSprites.remove(sprite); // 從 allSprites (default group) 中移除
		
		array.push(sprite);
	}

	update = () => {
		/* 顯示背景 */
		background(this._backgroundImage);
		this._repositionRoadsIfNeed();

		if(this._isCheckingNextSectionDistance) {
			this._checkIfShouldNextSection();
		}
		// Draw roads
		this._backgroundGroup.draw();
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
		if(!this.isCameraFollowPlayer) return;

		// Set camera follow player on y axis
		camera.y = followPoint.y + this.cameraYOffest;;
	}
	
	/**
	 * 取得只有馬路的 (minX, maxX)
	 * @returns {number[]} [leftBound, rightBound]
	 */
	getRoadXRange = () => {
		return [425, 855]; // 用 figma 量的
	}

	/**
	 * 取得馬路 + 人行道的 (minX, maxX)
	 * @returns {number[]} [leftBound, rightBound]
	 */
	getStreetXRange = () => {
		return [270, 1010]; // 用 figma 量的
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
	 * 依據背景圖片，取得遊戲的 y 範圍
	 * @returns {number[]} [minY, maxY]
	 */
	getGameYRange = () => {
		return [
			this._bgSprites[this._bgSprites.length - 1].position.y - this._bgSprites[this._bgSprites.length - 1].h / 2,
			this._bgSprites[0].position.y + this._bgSprites[0].h / 2
		]
	};
	
	/**
	 * 取得兩條路的中心 X 位置
	 * @returns {number[]} [左邊那條路的中心, 右邊那條路的中心]
	 */
	getRoadCenterXs = () => {
		let roadWidth = 433; // figma 量 
		return [width/2 - roadWidth/4, width/2 + roadWidth/4];
	}

	// 判斷 player 的螢幕畫面是否已經到最上面
	canPlayerSeeTopMost = (velY = 0) => {
		let screenTopY = gameManager.getVisibleYRange()[0];
		let minY = gameManager.getGameYRange()[0];
		return (screenTopY + velY <= minY);
	}

	setCameraFollowPlayer = (isFollowing) => {
		this.isCameraFollowPlayer = isFollowing
	}

	/**
	 *  要切換到下一個 section 時呼叫此 function，
	 *  會等玩家走了 n 個螢幕高度後，自動切換到下一個 section
	 *  
	 * Example:
	 *  	// 在一個段落的所有的事件完成後
	 *  	gameManager.nextSectionAfterScreenHeight();
	 * 
	 * @param {number} screenHeightCount 要往上走幾個螢幕高度後，才會進入下一個 section
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
		if(player.vel.y === 0) return;

		if (player.vel.y < 0) {
			this._roadSprites.forEach((roadSprite, i) => {
				let isVisible = roadSprite.visible;
				if (!isVisible) {
					let nextIndex = (i + 1) % this._roadSprites.length;
					roadSprite.position.y =
						this._roadSprites[nextIndex].position.y - this._roadHeight;
					

				}
			})
		}
		else if(player.vel.y > 0) {
			this._roadSprites.forEach((roadSprite, i) => {
				let isVisible = roadSprite.visible;
				if (!isVisible) {
					let prevIndex =
						(i - 1 + this._roadSprites.length) % this._roadSprites.length;
					roadSprite.position.y =
						this._roadSprites[prevIndex].position.y + this._roadHeight;

				}
			})
		}
	};
}
