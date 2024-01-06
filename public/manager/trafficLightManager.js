class TrafficLightManager {
    setup = () => {
        this._successText = loadImage("../images/text/text1.png");
        this._failText = loadImage("../images/text/text2.png");
        this._failText2 = loadImage("../images/text/text5.png");
    };

    draw = (status) => {
        let xCurrPosi = 0;
        let yCurrPosi = gameManager.getVisibleYRange()[0];

        if (status === "stopped") {
            image(this._successText, xCurrPosi, yCurrPosi, 1280, 720);
        } else {
            image(this._failText, xCurrPosi, yCurrPosi - 60, 1280, 720);
            image(this._failText2, xCurrPosi, yCurrPosi + 50, 1280, 720);
        }
    };
}
