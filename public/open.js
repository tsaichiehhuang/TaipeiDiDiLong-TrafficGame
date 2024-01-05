const IMG_Count = 7;
let openingImgs = [];
let currentImg = 0;
const x = 1020;
const y = 620;
const w = 180;
const h = 40;

function preload() {
    for (let i = 1; i <= IMG_Count; i++) {
        openingImgs.push(loadImage(`../images/opening/${i}.png`));
    }
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

function mousePressed() {
    // Check if mouse is pressed on button
    if (mouseX < x || mouseX > x + w || mouseY < y || mouseY > y + h) {
        return;
    }

    currentImg++;
    if (currentImg >= IMG_Count) {
        window.location.href = "game.html";
    } else {
        background(openingImgs[currentImg]);
    }
}