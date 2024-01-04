class CrossTheRoadManager {

    setup = () => {
        this._stopped = loadImage('../images/text/text6.png');
        this._notStopped = loadImage('../images/text//text7.png');
    };

    draw = (isStoppedInLevel) => {
        let xCurrPosi = (gameManager.getRoadXRange()[0] + gameManager.getRoadXRange()[1]) / 2;
        let yCurrPosi = (gameManager.getVisibleYRange()[0] + gameManager.getVisibleYRange()[1]) / 2;
        imageMode(CENTER); // 把圖的正中央當定位點
        
        if (isStoppedInLevel === "stopped") {
            image(this._stopped, xCurrPosi, yCurrPosi);
        }else {
            image(this._notStopped, xCurrPosi, yCurrPosi);
        }

    };
}