// 變數 ===========================================
let background_img_path = './images/start/Main_bg.png'; // 封面
let intro_game_button_path = './images/start/Howtoplay_1.png';
let game_started_button_path = './images/start/Play_1.png';
let how_to_play_path = './images/start/howtoplay.png';

// let game_title_path='./images/UI/start/title.png';

let intro_started = false;
let game_started = false;
// ===============================================

// p5js ==========================================
function preload() {
    background_img = loadImage(background_img_path);
    how_to_play = loadImage(how_to_play_path);
}

function setup() {
    createCanvas(1280, 720);
    background(background_img);

    // button:遊戲介紹
    intro_button = createImg(intro_game_button_path);
    intro_button.position(530, 600);
    intro_button.mousePressed(showHowToPlay);
    intro_button.mouseOver(() => intro_button.attribute('src', intro_game_button_path.replace('1.png', '2.png')));
    intro_button.mouseOut(() => intro_button.attribute('src', intro_game_button_path));

    // button:遊戲開始
    start_button = createImg(game_started_button_path);
    start_button.position(530, 500);
    start_button.mousePressed(() => game_started = true);
    start_button.mouseOver(() => start_button.attribute('src', game_started_button_path.replace('1.png', '2.png')));
    start_button.mouseOut(() => start_button.attribute('src', game_started_button_path));
}

function draw() {
    if (intro_started) {
        // 在指定位置顯示圖片
        image(how_to_play, 0, 0, width, height);
    }

    if (game_started) {
        window.location.href = "open.html";
    }
}

function showHowToPlay() {
    intro_started = true;
    
    // 隱藏介紹按鈕
    intro_button.hide();
    // 隱藏遊戲開始按鈕
    start_button.hide();
}

function mousePressed() {
    // 檢查是否點擊了圖片的右上角區域
    if (intro_started && mouseX > width - 130 && mouseY < 130) {
        background(background_img);
        intro_started = false;
        
        // 重新顯示介紹按鈕
        intro_button.show();
        // 重新顯示遊戲開始按鈕
        start_button.show();
    }
}