const IMG_Count = 7;
const x = 1020;
const y = 620;
const w = 180;
const h = 40;
let currentImg = 0;
let openingImgs = [];
let buttonSound;
let bgm;
function preload() {
    for (let i = 1; i <= IMG_Count; i++) {
        openingImgs.push(loadImage(`../images/opening/${i}.png`));
    }
    buttonSound = loadSound("../audio/按鈕.mp3");
    buttonSound.setVolume(0.5);
    bgm = loadSound("../audio/BGM.mp3");
    bgm.setVolume(0.5);
}

function setup() {
    createCanvas(1280, 720);
    background(openingImgs[currentImg]);
}

function draw() {

    // rect(1020, 620, 180, 40); // Button position
    if (mouseX < x || mouseX > x + w || mouseY < y || mouseY > y + h) {
        cursor(ARROW);
    } else {
        cursor(HAND);
    }
}

function keyPressed() {
    if (keyCode === ENTER) {
        next();
    }
}

function mousePressed() {
    // if(!bgm.isPlaying()) {
    //     bgm.play();
    // }
    
    // Check if mouse is pressed on button
    if (mouseX < x || mouseX > x + w || mouseY < y || mouseY > y + h) {
        return;
    }
    next();
}

function next() {
    buttonSound.play();
    currentImg++;
    if (currentImg >= IMG_Count) {
        window.location.href = "game.html";
    } else {
        background(openingImgs[currentImg]);
    }
}