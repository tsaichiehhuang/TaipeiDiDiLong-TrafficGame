
class ViolationManager {

    setup = () => {
        this._realredLineParkingVio = loadImage('../images/section1/Warn1.png'); // "redLineParking"
        this._realdoubleParkingVio = loadImage('../images/section2/Warn2.png'); // "doubleParking"
        this.realnotYieldPersonVio = loadImage("../images/section3/Warn3.png"); // "notYieldPerson"
        this.realcrossHatchParkingVio = loadImage('../images/section4/Wrong4.png'); // "crossHatchParking"
        this._realrunningRedLightVio = loadImage('../images/section5/Warn5.png'); // "runningRedLight"
    };

    draw = (whichViolation) => {
        
        // Break out the game when report success
        let xCurrPosi = (gameManager.getRoadXRange()[0] + gameManager.getRoadXRange()[1]) / 2;
        let yCurrPosi = (gameManager.getVisibleYRange()[0] + gameManager.getVisibleYRange()[1]) / 2;
        imageMode(CENTER); // 把圖的正中央當定位點
        // 判斷是哪個違規事件
        switch(whichViolation) {
            case "redLineParking":
                image(this._realredLineParkingVio, xCurrPosi, yCurrPosi);
                break;
            case "doubleParking":
                image(this._realdoubleParkingVio, xCurrPosi, yCurrPosi);
                break;
            case "notYieldPerson":
                image(this.realnotYieldPersonVio, xCurrPosi, yCurrPosi);
                break;
            case "runningRedLight":
                image(this._realrunningRedLightVio, xCurrPosi, yCurrPosi);
                break;
            case "crossHatchParking":
                image(this.realcrossHatchParkingVio, xCurrPosi, yCurrPosi);
                break;
        }
        keyPressedManager.setKeyPressedStop(true);
    }; 
}