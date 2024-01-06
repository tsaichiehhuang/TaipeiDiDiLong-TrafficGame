// 變數 ===========================================
let background_img_path = "./images/start/Main_bg.png"; // 封面
let intro_game_button_path = "./images/start/Howtoplay_1.png";
let game_started_button_path = "./images/start/Play_1.png";
let how_to_play_path = "./images/start/howtoplay.png";
let how_to_play_path_x = './images/start/X.png';

let background_img;
let how_to_play;
let how_to_play_x;

let intro_started = false;
let game_started = false;
// ===============================================
const openingUIController = new OpeningUIController();

// p5js ==========================================
function preload() {
    background_img = loadImage(background_img_path);
    how_to_play = loadImage(how_to_play_path);
    how_to_play_x = loadImage(how_to_play_path_x);
    openingUIController.preload();
}

function setup() {
    createCanvas(1280, 720);
    background(background_img);

    // button:遊戲介紹
    intro_button = createImg(intro_game_button_path);
    intro_button.position(width / 2 - intro_button.width / 2, 600);
    intro_button.mousePressed(showHowToPlay);
    intro_button.mouseOver(() =>
        intro_button.attribute(
            "src",
            intro_game_button_path.replace("1.png", "2.png")
        )
    );
    intro_button.mouseOut(() =>
        intro_button.attribute("src", intro_game_button_path)
    );

    // button:遊戲開始
    start_button = createImg(game_started_button_path);
    start_button.position(width / 2 - start_button.width / 2, 500);
    start_button.mousePressed(() => {
        game_started = true;
        startOpening();
    });
    start_button.mouseOver(() =>
        start_button.attribute(
            "src",
            game_started_button_path.replace("1.png", "2.png")
        )
    );
    start_button.mouseOut(() =>
        start_button.attribute("src", game_started_button_path)
    );
}

function draw() {
    if (game_started) {
        openingUIController.draw();
        return;
    }

    if (intro_started) {
        // 在指定位置顯示圖片
        image(how_to_play, 0, 0, width, height);
    }

    if (intro_started && mouseX > width - 130 && mouseY < 130 && mouseX < width - 40 && mouseY > 40) {
        image(how_to_play_x, 0, 0, width, height);
    }
}

function startOpening() {
    // 隱藏介紹按鈕
    intro_button.hide();
    // 隱藏遊戲開始按鈕
    start_button.hide();
}

function showHowToPlay() {
    intro_started = true;

    // 隱藏介紹按鈕
    intro_button.hide();
    // 隱藏遊戲開始按鈕
    start_button.hide();
}

function mousePressed() {
    if (game_started) {
        openingUIController.onMousePressed();
        return;
    }
    // 檢查是否點擊了圖片的右上角區域
    if (intro_started && mouseX > width - 130 && mouseY < 130 && mouseX < width - 40 && mouseY > 40) {
        background(background_img);
        intro_started = false;

        // 重新顯示介紹按鈕
        intro_button.show();
        // 重新顯示遊戲開始按鈕
        start_button.show();
    }
}

function keyPressed() {
    if (game_started) {
        if (keyCode === ENTER) {
            openingUIController.next();
        }
    }
}
