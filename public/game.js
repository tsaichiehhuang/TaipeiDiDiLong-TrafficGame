// 既然始終只有一頁，那就來寫一個長長的 main 叭 > <

const { text } = require("express");

// 變數 ===========================================
let background_img_path = './images/background.jpg'; // 馬路
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
    background_img = loadImage(background_img_path);
}

function setup() {
    createCanvas(1000, 600);
    
}

function draw() {
    /* 顯示背景 */
    background(background_img_path);

    /* 畫出分數 */
    drawPlayerScore(800, 100, 20);
}

// ===============================================