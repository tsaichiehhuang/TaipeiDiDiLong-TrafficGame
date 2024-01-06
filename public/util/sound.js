const allSounds = new Map();

function preloadSounds() {
    // 正確答案
    let correctSound = loadSound("audio/正確答案.wav");
    correctSound.setVolume(0.5)
    allSounds.set("correct", correctSound);

    // 錯誤答案
    let wrongSound = loadSound("audio/錯誤答案.wav");
    wrongSound.setVolume(0.5)
    allSounds.set("wrong", wrongSound);

    // 檢舉拍照
    let photoSound = loadSound("audio/相機攝影.mp3");
    photoSound.setVolume(0.5)
    allSounds.set("photo", photoSound);

    // 買飲料或便當拍照
    let buySound = loadSound("audio/商店聲音.mp3");
    photoSound.setVolume(0.5)
    allSounds.set("buy", buySound);

}