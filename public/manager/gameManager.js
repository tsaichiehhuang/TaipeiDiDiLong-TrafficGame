class GameManager {
  constructor() {
    this._roadSprites = [];
    this._roadImage = null;
    this._roadHeight = 600; // road image height
    this._backgroundSpeed = 0;
  }

  preload = () => {
    this._roadImage = loadImage("images/road/road_bg.png");
  };

  setup = () => {
    // Make multiple road, so they can look like scrolling
    for (let i = 0; i < 3; i++) {
      let yPos = i * this._roadHeight;
      let sprite = createSprite(width / 2, yPos);
      sprite.addImage(this._roadImage);
      this._roadSprites.push(sprite);
    }
  };

  update = () => {
    // Update the position of the road
    this._roadSprites.forEach((roadSprite, i) => {
      roadSprite.position.y += this._backgroundSpeed;
    });

    this._repositionRoadsIfNeed();
  };

  setBackgroundSpeed = (newSpeed) => {
    this._backgroundSpeed = newSpeed;
  };

  getBackgroundSpeed = () => {
    console.log(this._backgroundSpeed);
    return this._backgroundSpeed;
  };

  // Check if the road needs to be repositioned based on scroll direction
  _repositionRoadsIfNeed = () => {
    this._roadSprites.forEach((roadSprite, i) => {
      let halfRoadHeight = this._roadHeight / 2;

      if (this._backgroundSpeed > 0) {
        let isOutOfBottomScreen =
          roadSprite.position.y > height + halfRoadHeight;
        if (isOutOfBottomScreen) {
          let nextIndex = (i + 1) % this._roadSprites.length;
          roadSprite.position.y =
            this._roadSprites[nextIndex].position.y - this._roadHeight;
        }
      } else if (this._backgroundSpeed < 0) {
        let isOutOfTopScreen = roadSprite.position.y < -halfRoadHeight;
        if (isOutOfTopScreen) {
          let prevIndex =
            (i - 1 + this._roadSprites.length) % this._roadSprites.length;
          roadSprite.position.y =
            this._roadSprites[prevIndex].position.y + this._roadHeight;
        }
      }
    });
  };
}
