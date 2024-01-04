let showText = true;

class RunRedLightManager {
    setup = () => {
        this._successText = loadImage("../images/text/text1.png");
        this._failText = loadImage("../images/text/text2.png");
        this._failText2 = loadImage("../images/text/text2.png");
    };

    draw = (status) => {
        // Break out the game when report success
        setTimeout(() => {
            showText = false;
        }, 2500);

        if (showText) {
            let xCurrPosi = 0;
            let yCurrPosi = gameManager.getVisibleYRange()[0];

            // 判斷有沒有違規
            if (status === "stopped") {
                image(this._successText, xCurrPosi, yCurrPosi, 1280, 720);
            } else {
                image(this._failText, xCurrPosi, yCurrPosi, 1280, 720);
                image(this._failText2, xCurrPosi, yCurrPosi, 1280, 720);
            }
        }
    };
}
