// 變數 ===========================================
let background_img_path = './images/start.gif'; // 馬路
// let game_title_path='./images/UI/start/title.png';

let intro_started = false;
let game_started = false;
// ===============================================

// p5js ==========================================
function preload() {
    background_img = loadImage(background_img_path);
}

function setup() {
    createCanvas(1000, 600);
    background(background_img);

    textSize(60);
    title_text = text('歹把迪迪隆 Taipei Di-Di Long', 80, 80);
    // title_text.style('font-size', '50px');

    // button:遊戲開始
    start_button = createButton("開始遊戲");
    start_button.position(450, 500); 
    start_button.style('font-size', '40px');
    start_button.mousePressed(() => game_started = true);
}

function draw() {
    if (game_started) {
        window.location.href = "game.html" ;
    }
}