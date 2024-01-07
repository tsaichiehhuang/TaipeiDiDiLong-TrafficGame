function preloadCarImages() {
    const carImages = []
    for (let i = 1; i <= 5; i++) {
        carImages.push(loadImage(`../images/objects/car/Car_${i}.png`))
    }
    return carImages
}

// A demo of car
// If collision happens, the player will lose 1 score
class Car {
    /**
     * @param {number} carType 車子圖片的編號(1~6)，不提供的話會隨機選一個
     */
    constructor(carType = null) {
        this.carSpeed = -0.5
        this.collided = false
        this.acc = 0.125
        this.colliderOffset = -20
        this._spritesWillStop = []
        this.isChangingRoad = false
        this._isRemoveingIfcan = false

        if (carType === null) {
            this.carType = Math.floor(Math.random() * 5) + 1
        } else {
            this.carType = carType
        }
    }

    setup(startX = width / 2, startY = height / 4, speed = this.carSpeed) {
        this.carSpeed = speed
        let car = new Sprite(startX, startY)
        console.log('carImages', carImages)
        car.img = carImages[this.carType - 1]
        console.log(car.img)
        car.w += this.colliderOffset
        car.h += this.colliderOffset
        car.vel.y = this.carSpeed
        car.debug = gameManager.debugMode // TODO: remove this debug feature
        car.autoDraw = false
        allSprites.remove(car)
        car.mass = 15
        car.rotationLock = true // 車被撞之後旋轉有點怪

        let frontOffset = 150

        // 在車子前面加一個 sensor，用來偵測前方有沒有需要停下來的物體
        //https://github.com/Tezumie/into-the-mines/blob/5839c139e52555353d180aa91d25f8bf9913ac2f/player.js#L295
        car.frontSensor = new Sprite(width / 2 + 50, startY - frontOffset, width / 2.5, 100, 'n')
        car.frontSensor.debug = gameManager.debugMode
        car.frontSensor.visible = false
        let j = new GlueJoint(car, car.frontSensor)
        j.visible = false

        let [left, right] = gameManager.getRoadCenterXs()
        let roadWidthHalf = right - left

        // 偵測是否要換到另一條車道
        car.roadSensor = new Sprite(startX, startY - frontOffset, roadWidthHalf - 10, 100, 'n')
        car.roadSensor.debug = gameManager.debugMode
        car.roadSensor.visible = false
        j = new GlueJoint(car, car.roadSensor)
        j.visible = false

        this.sprite = car
        this.sprite.body.sprite = this.sprite

        registerSparkWhenCollide(this.sprite, sparkController)
    }

    setIsMoving(isMoving) {
        if (isMoving) {
            this.sprite.vel.y = this.carSpeed
        } else {
            this.sprite.vel.y = 0
        }
    }

    _isNeedToStop() {
        for (let sprite of this._spritesWillStop) {
            if (this.sprite.frontSensor.overlapping(sprite)) {
                return true
            }
        }
        return false
    }

    setWillStopBefore = (sprite) => {
        this._spritesWillStop.push(sprite)
    }

    onRoadSensorOverlapping = () => {
        if (this._isChangingRoad) return
        this._isChangingRoad = true
        this._targetRoad = this.sprite.position.x < width / 2 ? 'right' : 'left'
    }

    setWillChangeRoad(sprite) {
        this.sprite.roadSensor.overlapping(sprite, this.onRoadSensorOverlapping)
    }

    draw = () => {
        if (!this.sprite) return
        this.sprite.draw()

        if (this.collided && abs(this.sprite.vel.y) > 0 && abs(this.sprite.vel.x) > 0) {
            // update speed by accerlation
            this.sprite.vel.y = min(0, this.sprite.vel.y + this.acc)
            this.sprite.vel.x = min(0, this.sprite.vel.x + this.acc)
            return
        }

        if (this._isNeedToStop()) {
            this.setIsMoving(false)
        } else {
            this.setIsMoving(true)
        }

        if (this._isChangingRoad) {
            if (this._targetRoad == 'right') {
                this.setIsMoving(false)
                // this.sprite.moveTowards(gameManager.getRoadCenterXs()[1], this.sprite.position.y, 2 / frameRate())
                // if (this.sprite.position.x >= gameManager.getRoadCenterXs()[1] - 20) {
                //     this._isChangingRoad = false
                //     this.sprite.vel.x = 0
                //     this.setIsMoving(true)
                // }
            } else {
                this.sprite.moveTowards(gameManager.getRoadCenterXs()[0], this.sprite.position.y, 2 / frameRate())
                if (this.sprite.position.x <= gameManager.getRoadCenterXs()[0] + 20) {
                    this._isChangingRoad = false
                    this.sprite.vel.x = 0
                    this.setIsMoving(true)
                }
            }
        }

        if (this.sprite.collide(playerController.getPlayer())) {
            playerData.addScore(-10)
            this.collided = true
        }
    }

    /**
     * 更新速度
     */
    updateSpeed(speed) {
        if (speed >= 0) return // 只能往前
        this.carSpeed = speed
    }
}
