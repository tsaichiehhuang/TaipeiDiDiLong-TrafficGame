
let showImaAndText = true;
class ViolationManager {

    setup = () => {
        this._realredLineVio = loadImage('../images/start.gif'); // "redLineParking"
    };

    draw = (whichViolation) => {
        // Break out the game when report success
        setTimeout(() => { showImaAndText = false; }, 2000);

        if(showImaAndText) {
            let xCurrPosi = (gameManager.getRoadXRange()[0] + gameManager.getRoadXRange()[1]) / 2;
            let yCurrPosi = (gameManager.getVisibleYRange()[0] + gameManager.getVisibleYRange()[1]) / 2;
            imageMode(CENTER); // 把圖的正中央當定位點
            // 判斷是哪個違規事件
            switch (whichViolation){
                case "redLineParking":
                    image(this._realredLineVio, xCurrPosi, yCurrPosi);
                    break;
            }

            
        }

    };

}