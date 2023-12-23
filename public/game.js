// System  ================================
const gameManager = new GameManager();
const eventManager = new EventManager();
const playerData = new PlayerData();
const playerController = new PlayerController(); //For demo

// UIs =======================================
const mainUIController = new MainUIController();

// Sections ================================
const sectionManager = SectionManager(gameManager);

// Player
let player; // be created after PlayerController.setup()

// Objects ========================================
let car = new Car(); // demo car (moving object)

// p5js ==========================================
function preload() {
    gameManager.preload();
    mainUIController.preload();
    sectionManager.preloadSections();
}

function setup() {
    gameManager.setup();
    gameManager.addSectionChangedCallback(sectionManager.onSectionChanged);

    mainUIController.setup();
    mainUIController.setTaskText('測試：三寶上路');

    playerData.onScoreChange((score) => {
        mainUIController.setScore(score);
    })

    // Setup player controller and player instance
    playerController.setup();
    player = playerController.getPlayer();

    // Demo moving objects
    car.setup();

    // Start from section 1
    sectionManager.startFirstSection();

    // Prevent sprites overlayed UI or section text
    allSprites.autoDraw = false;
}

function draw() {
    gameManager.update();
    gameManager.cameraFollow(player.position);

    camera.on();
    allSprites.draw();
    camera.off();

    update();

    sectionManager.drawSections();
    mainUIController.update();
}

function keyPressed() {

    // For demo moving
    switch (keyCode) {
        case UP_ARROW:
            playerController.move('up');
            break;
        case DOWN_ARROW:
            playerController.move('down');  
            break;
        case LEFT_ARROW:
            break;
        case RIGHT_ARROW:
            break;
        default:
            break;
    }
}

function keyReleased() {
    // For demo 
    playerController.move('stop');
}

function mousePressed() {
    // TODO: discussion fullscreen
    fullscreen(true);
}

// fuctions =======================================

// Update values
function update() {
    car.update();
}