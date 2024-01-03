class KeyPressedManager {
    constructor() {
        this.keyPressedStop = false;
    };

    setKeyPressedStop(status) {
        // status = true or false
        this.keyPressedStop = status;
    };

    getKeyPressedStop() {
        return this.keyPressedStop;
    };

}