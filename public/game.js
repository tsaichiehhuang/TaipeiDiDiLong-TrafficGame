// System  ================================
const gameManager = new GameManager();
const eventManager = new EventManager();
const playerData = new PlayerData();
const playerController = new PlayerController(); //For demo
const violationManager = new ViolationManager();
const runRedLightManager = new RunRedLightManager();
const questionManager = new QuestionManager();
const keyPressedManager = new KeyPressedManager(); //control keyPressed function

// UIs =======================================
const mainUIController = new MainUIController();


// Sections ================================
const sectionManager = SectionManager(gameManager);


// Player
let player; // be created after PlayerController.setup()

// Objects
const sparkController = new SparkController();

// Shared Images
let carImages;

// p5js ==========================================
function preload() {
  gameManager.preload();
  mainUIController.preload();
  sectionManager.preloadSections();
  carImages = preloadCarImages();
  playerController.preload();
  sparkController.preload();
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

  // Start from section 1
  sectionManager.startFirstSection();

  // Prevent sprites overlayed UI or section text
  allSprites.autoDraw = false;

  // Violation Success
  violationManager.setup();

  // 開始紀錄所有與玩家碰撞的 sprite 的最新碰撞點
  recordPlayerCollidePoint();

  sparkController.setup();
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

  // Report Wrong
  if (keyIsDown(32)) {
    const currentEvents = eventManager.getCurrentEvent();
    for (let eachEvent of currentEvents) {
      console.log("currentEvent -> " + eachEvent);
    }
    if (
      !currentEvents.has(
        EVENT_REPORT_RED_LINE_PARKING || EVENT_REPORT_DOUBLE_PARKING || EVENT_REPORT_NOT_YIELDING_TO_PEDESTRIANS || EVENT_REPORT_ILLEGAL_MAKE_A_U_TURN || EVENT_REPORT_RUNNING_RED_LIGHT
      )
    ) {
      playerData.addScore(-0.5);
      console.log("fail report -0.5");
    }
  }

  // For demo moving
  // keyPressedManager.getKeyPressedStop()=true -> 玩家不能移動(檢舉成功圖片顯示時&關卡完成&情境出現時)
  if(!keyPressedManager.getKeyPressedStop()) {
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
  
  mainUIController.setArrowKeyIsDown(keyCode, true);
}

function keyReleased() {
  if (gameManager.isEnded()) return;

  // For demo
  playerController.move("stop");
  
  mainUIController.setArrowKeyIsDown(keyCode, false);
}

function mousePressed() {
  // TODO: discussion fullscreen
  // fullscreen(true);
}

// fuctions =======================================

// Update values
function update() {
  // 在買飲料事件進行時，讓玩家可以開到人行道上(因為停車格在人行道上)
  if(eventManager.getCurrentEvent().has(EVENT_LEVEL_BUY_DRINK)) {
    playerController.update(true);
  } else {
    playerController.update(false); //let player‘s movement range not exceed the road
  }
  
}
