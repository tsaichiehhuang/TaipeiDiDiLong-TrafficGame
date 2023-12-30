// A demo of section
const Section1 = () => {
  let sectionVariable = "This is a variable in Section1 scope";

  // Demo walker a in section
  let walker1 = new Walker((startPosY = 100), "第一個行人");

  // get car position y when EVENT_REPORT_RED_LINE_PARKING start
  let startPosiY;

  // red line violation success var
  let successVio = false;

  // red light success and image position
  let trafficLightImg;
  let showRedLightText = false;
  let isStoppedInRedLight = false;

  return {
    preload: () => {
      // Called in p5.js preload() function
      console.log("Section 1 preload");

      // load red line parking violation img
      this._redLineVio = loadImage("../images/redLineParking.jpeg");
      this._redLightImg = loadImage("../images/redLight.png");
      this._yellowLightImg = loadImage("../images/yellowLight.png");
      this._greenLightImg = loadImage("../images/greenLight.png");
    },

    onSectionStart: () => {
      walker1.setup(gameManager.getRoadXRange());

      // Demo start and success event
      eventManager.startEvent(EVENT_REPORT_RED_LINE_PARKING, 3000); // start after 4 second
      eventManager.startEvent(EVENT_LEVEL_TRAFFIC_LIGHT, 6000);

      // 檢舉：紅線停車
      eventManager.listen(EVENT_REPORT_RED_LINE_PARKING, (status) => {
        console.log("Red line event : " + status);
        switch (status) {
          case EventStatus.START:
            // get car y position when status is start
            startPosiY = playerController.getPlayer().position.y;
            break;
          case EventStatus.SUCCESS:
            // Do something
            console.log("Report Success!");
            break;
          case EventStatus.FAIL:
            // Do something
            console.log("Report Fail!");
            break;
        }
      });

      //監聽紅綠燈事件
      eventManager.listen(EVENT_LEVEL_TRAFFIC_LIGHT, (status) => {
        console.log("Traffic light event : " + status);
        switch (status) {
          case EventStatus.START:
            // 紅綠燈事件開始時，先顯示黃燈，1.5 秒後顯示紅燈
            trafficLightImg = this._yellowLightImg;
            setTimeout(() => {
              trafficLightImg = this._redLightImg;
            }, 1500);
            break;
          case EventStatus.SUCCESS:
            // 停紅綠燈 1.5 秒後觸發玉蘭花情境題
            isStoppedInRedLight = true;
            setTimeout(() => {
              showRedLightText = true;
            }, 1000);
            //TODO: 要限制玩家不能動？
            eventManager.startEvent(EVENT_QA_FLOWER_SELLER, 1500);
            console.log("Traffic light Success!");
            break;
          case EventStatus.FAIL:
            isStoppedInRedLight = false;
            showRedLightText = true;

            setTimeout(() => {
              trafficLightImg = this._greenLightImg;
            }, 3000);
            console.log("Traffic light Fail!");
            break;
        }
      });
    },

    draw: () => {
      // 不管哪個 section，都會執行
      // 原本的 drawAlways()
      // 在這畫圖會畫在 player 底下！

      walker1.update();

      // 路邊紅線停車事件
      image(
        this._redLineVio,
        gameManager.getRoadXRange()[1] - this._redLineVio.width,
        startPosiY - 750
      );

      // 紅綠燈圖片
      // 畫面上一開始先顯示綠燈圖片，紅燈事件觸發時才顯示紅燈圖片
      trafficLightImg = trafficLightImg || this._greenLightImg;
      image(
        trafficLightImg,
        gameManager.getRoadXRange()[1] - 400,
        startPosiY - 1500,
        200,
        200
      );

      // --------  原本的 drawDuringSection() ----------------
      // 這裡的程式碼只會在第 1 段執行
      if (gameManager.getSection() == 1) {
        console.log("Section 1 draw");
        const currentEvents = eventManager.getCurrentEvent();

        if (currentEvents.has(EVENT_REPORT_RED_LINE_PARKING)) {
          // Report on time or not
          if (keyIsDown(32)) {
            eventManager.successEvent(EVENT_REPORT_RED_LINE_PARKING);
            successVio = true;
          } else if (
            playerController.getPlayer().position.y + 50 <
            startPosiY - 750
          ) {
            eventManager.failEvent(EVENT_REPORT_RED_LINE_PARKING);
          }
        }

        // Break out the game when report success
        if (successVio) {
          violationManager.draw("redLineParking");
        }

        // 紅綠燈事件
        if (currentEvents.has(EVENT_LEVEL_TRAFFIC_LIGHT)) {
          const isPlayerStopped = playerController.getPlayer().velocity.y === 0;

          if (isPlayerStopped) {
            if (
              playerController.getPlayer().position.y +
                playerController.getPlayer().height / 2 <
              50
            ) {
              eventManager.successEvent(EVENT_LEVEL_TRAFFIC_LIGHT);
            }
          } else if (
            playerController.getPlayer().position.y + 50 <
            startPosiY - 1500
          ) {
            eventManager.failEvent(EVENT_LEVEL_TRAFFIC_LIGHT);
          }
        }

        if (showRedLightText) {
          runRedLightManager.draw(
            isStoppedInRedLight ? "stopped" : "notStopped"
          );
        }

        playerController.draw(); // 畫玩家

        // 在這畫圖會蓋在 player 上面！
      }
      // -------------------------------------------

      // 不管哪個 section，都會執行
      // 在這畫圖會蓋在 player 上面！
    },

    onSectionEnd: () => {
      console.log("Section 1 end");
      // 可能結束所有此 section 的事件
      // 或是 trigger 下一階段的事件

      // 清除之後不會再用到的事件 listener
      eventManager.clearListeners([
        EVENT_REPORT_RED_LINE_PARKING,
        EVENT_LEVEL_TRAFFIC_LIGHT,
        EVENT_QA_FLOWER_SELLER,
      ]);
    },
  };
};
