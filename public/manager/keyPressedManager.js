class KeyPressedManager {
    constructor() {
        this.keyPressedStop = false;
    };

    setKeyPressedStop(status) {
        // status = true or false
        this.keyPressedStop = status;

        // 停止顯示紅色 UI，玩家不能移動且 UI 也不會被檢舉遮住
        mainUIController.setIsShowing(!status);
    };

    getKeyPressedStop() {
        return this.keyPressedStop;
    };

}