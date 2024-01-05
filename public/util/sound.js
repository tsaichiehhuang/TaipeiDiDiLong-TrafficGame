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
}