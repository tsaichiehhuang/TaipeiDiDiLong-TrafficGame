
let showImgAndText = true;
class ViolationManager {

    setup = () => {
        this._realredLineParkingVio = loadImage('../images/start.gif'); // "redLineParking"
        this._realrunningRedLightVio = loadImage('../images/start.gif'); // "runningRedLight"
    };

    draw = (whichViolation, showImgAndText) => {
        
        // Break out the game when report success
        if(showImgAndText) {
            let xCurrPosi = (gameManager.getRoadXRange()[0] + gameManager.getRoadXRange()[1]) / 2;
            let yCurrPosi = (gameManager.getVisibleYRange()[0] + gameManager.getVisibleYRange()[1]) / 2;
            imageMode(CENTER); // 把圖的正中央當定位點
            // 判斷是哪個違規事件
            switch(whichViolation) {
                case "redLineParking":
                    image(this._realredLineParkingVio, xCurrPosi, yCurrPosi);
                    break;
                case "runningRedLight":
                    image(this._realrunningRedLightVio, xCurrPosi, yCurrPosi);
                    break;
            }
        }
    }; 
}