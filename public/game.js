// System  ================================
const gameManager = new GameManager();
const eventManager = new EventManager();
const playerData = new PlayerData();
const playerController = new PlayerController(); //For demo
const violationManager = new ViolationManager();
const runRedLightManager = new RunRedLightManager();
const questionManager = new QuestionManager();

// UIs =======================================
const mainUIController = new MainUIController();

// Sections ================================
const sectionManager = SectionManager(gameManager);

// Player
let player; // be created after PlayerController.setup()

// Objects ========================================
let car = new Car(); // demo car (moving object)

// Shared Images
let carImages;

// p5js ==========================================
function preload() {
  gameManager.preload();
  mainUIController.preload();
  sectionManager.preloadSections();
  carImages = preloadCarImages();
  car.preload();
}

function setup() {
  gameManager.setup();
  gameManager.addSectionChangedCallback(sectionManager.onSectionChanged);

  mainUIController.setup();
  mainUIController.setTaskText("測試：三寶上路");

  mainUIController.setScore(playerData.getScore()); // 設定 UI 上的分數
  playerData.onScoreChange((score) => {
    mainUIController.setScore(score);
  });

  // Setup player controller and player instance
  playerController.setup();
  player = playerController.getPlayer();

  // Demo moving objects
  car.setup();

  // Start from section 1
  sectionManager.startFirstSection();

  // Prevent sprites overlayed UI or section text
  allSprites.autoDraw = false;

  // Violation Success
  violationManager.setup();
}

function draw() {
  gameManager.cameraFollow(player.position);

  camera.on();

  gameManager.update(); // 更新背景、畫背景
  allSprites.draw(); // 畫所有物件

  update();

  sectionManager.drawSections();

  camera.off();
  mainUIController.update();
}

function keyPressed() {
  if (gameManager.isEnded()) return;

  // For demo moving
  switch (keyCode) {
    case UP_ARROW:
      playerController.move("up");
      break;
    case DOWN_ARROW:
      playerController.move("down");
      break;
    case LEFT_ARROW:
      playerController.move("left");
      break;
    case RIGHT_ARROW:
      playerController.move("right");
      break;
    default:
      break;
  }
}

function keyReleased() {
  if (gameManager.isEnded()) return;

  // For demo
  playerController.move("stop");
}

function mousePressed() {
  // TODO: discussion fullscreen
  // fullscreen(true);
}

// fuctions =======================================

// Update values
function update() {
  car.update();
  playerController.update(); //let player‘s movement range not exceed the road
}
