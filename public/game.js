// 既然始終只有一頁，那就來寫一個長長的 main 叭 > <

// const { text } = require("express");

// Managers  ================================
let gameManager;


// 變數 ===========================================
let background_img_path = 'images/start.gif'; // 馬路
let run_status = 0; // 0 是開始，1~無限是要做什麼的執行階段

let score = 0;
// ===============================================


// fuction =======================================

function addScore(value){
    score += value;
}

function subScore(value){
    score -= value;
    score = Math.max(score, 0); // 最低就是 0 分
}

/*
 *  繪製分數
 */
function drawPlayerScore(x, y, size){
    textSize(size);
    text(score.toString(), x, y);
}

// p5js ==========================================
function preload() {
    gameManager = new GameManager();
    gameManager.preload();
    background_img = loadImage(background_img_path);
}

function setup() {
    createCanvas(1280, 720);
    gameManager.setup();
}

function draw() {
    /* 顯示背景 */
    background(background_img);
    
    gameManager.update();
    
    drawSprites();

    /* 畫出分數 */
    drawPlayerScore(800, 100, 20);
}

function keyPressed() {
    // For demo background speed
    if (keyCode === UP_ARROW) {
      gameManager.setBackgroundSpeed(5);
    } else if (keyCode === DOWN_ARROW) {
      gameManager.setBackgroundSpeed(-5);
    }  
}

function keyReleased() {
    // For demo background speed
    gameManager.setBackgroundSpeed(0);
}

function mousePressed(){
    fullscreen(true);
}

// ===============================================