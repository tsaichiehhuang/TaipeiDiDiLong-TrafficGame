// A demo of section
const Section1 = () => {
  let sectionVariable = "This is a variable in Section1 scope";

  // Demo walker a in section
  let walker1 = new Walker((startPosY = 100), "第一個行人");

  // get car position y when EVENT_REPORT_RED_LINE_PARKING start
  let startPosiY;

  // red line violation success var
  let successVio_RedLineParking = false;

  let showImgAndText;

  // red light success and image position
  let trafficLightImg;
  let showRedLightText = false;
  let isStoppedInRedLight = false;

  let flowerSellerX;
  let flowerSellerY;
  let qaQuestion;
  let showQaQuestion = false;

  return {
    preload: () => {
      // Called in p5.js preload() function
      console.log("Section 1 preload");

      // load red line parking violation img
      this._redLineVio = loadImage("../images/redLineParking.jpeg");
      this._redLightImg = loadImage("../images/redLight.png");
      this._yellowLightImg = loadImage("../images/yellowLight.png");
      this._greenLightImg = loadImage("../images/greenLight.png");
      this._crosswalkImg = loadImage("../images/crosswalk.png");
      this._flowerSellert = loadImage("../images/flowerSellert.png");
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
            // get car y position when red line parking status is start
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
            }, 1000);
            break;
          case EventStatus.SUCCESS:
            // 停紅綠燈 0.5 秒後觸發玉蘭花情境題
            isStoppedInRedLight = true;
            setTimeout(() => {
              showRedLightText = true;
            }, 500);
            //TODO: 要限制玩家不能動？
            eventManager.startEvent(EVENT_QA_FLOWER_SELLER, 500);
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

      // 監聽玉蘭花情境題事件
      eventManager.listen(EVENT_QA_FLOWER_SELLER, (status) => {
        console.log("Flower seller event : " + status);
        switch (status) {
          case EventStatus.START:
            // 初始化玉蘭花阿婆的位置，從畫面右邊開始，往左移動，y軸位置在斑馬線的上方
            flowerSellerX = gameManager.getRoadXRange()[1];
            flowerSellerY = startPosiY - 1250 + 150;
            qaQuestion = questionManager.getRadomQuestion();
            break;
          case EventStatus.SUCCESS:
            // 玉蘭花情境題成功時，過0.5秒後變回綠燈
            setTimeout(() => {
              trafficLightImg = this._greenLightImg;
            }, 500);
            console.log("Flower seller Success!");
            gameManager.nextSectionAfterScreenHeight();
            break;
          case EventStatus.FAIL:
            // 玉蘭花情境題失敗時，過0.5秒後變回綠燈
            setTimeout(() => {
              trafficLightImg = this._greenLightImg;
            }, 500);
            console.log("Flower seller Fail!");
            gameManager.nextSectionAfterScreenHeight();
            break;
        }
      });
    },

    draw: () => {
      // 不管哪個 section，都會執行
      // 原本的 drawAlways()
      // 在這畫圖會畫在 player 底下！

      walker1.update();

      // trigger red line parking img
      image(
        this._redLineVio,
        gameManager.getRoadXRange()[1] - this._redLineVio.width,
        startPosiY - 750
      );

      // 紅綠燈＆斑馬線
      // 畫面上一開始先顯示綠燈圖片，紅燈事件觸發時才顯示紅燈圖片
      image(
        this._crosswalkImg,
        gameManager.getRoadXRange()[1] - this._crosswalkImg.width,
        startPosiY - 1250 + 150,
        this._crosswalkImg.width,
        150
      );

      trafficLightImg = trafficLightImg || this._greenLightImg;
      image(
        trafficLightImg,
        gameManager.getRoadXRange()[1] - 400,
        startPosiY - 1250,
        150,
        150
      );

      // --------  原本的 drawDuringSection() ----------------
      // 這裡的程式碼只會在第 1 段執行
      if (gameManager.getSection() == 1) {
        console.log("Section 1 draw");
        const currentEvents = eventManager.getCurrentEvent();

        // Demo draw based on current event
        if (currentEvents.has(EVENT_LEVEL_TRAFFIC_LIGHT)) {
          // 畫紅綠燈的相關遊戲元素
          text("紅綠燈相關事件...即將加分", 60, 100);
        }

        // Report on time or not when red line parking event start
        if (currentEvents.has(EVENT_REPORT_RED_LINE_PARKING)) {
          if (keyIsDown(32)) {
            eventManager.successEvent(EVENT_REPORT_RED_LINE_PARKING);
            showImgAndText = true;
            successVio_RedLineParking = true;
          } else if (
            playerController.getPlayer().position.y + 50 <
            startPosiY - 750
          ) {
            eventManager.endEvent(EVENT_REPORT_RED_LINE_PARKING);
          }
        }

        // Traffic light event
        if (currentEvents.has(EVENT_LEVEL_TRAFFIC_LIGHT)) {
          const isPlayerStopped = playerController.getPlayer().velocity.y === 0;

          if (isPlayerStopped) {
            if (
              playerController.getPlayer().position.y + 50 <
                startPosiY - 1250 + 500 &&
              playerController.getPlayer().position.y +
                playerController.getPlayer().height / 2 <
                50
            )
              eventManager.successEvent(EVENT_LEVEL_TRAFFIC_LIGHT);
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

        if (eventManager.getCurrentEvent().has(EVENT_QA_FLOWER_SELLER)) {
          image(this._flowerSellert, flowerSellerX, flowerSellerY, 100, 100);
          flowerSellerX -= 2; // 每幀向左移動2像素

          if (flowerSellerX < playerController.getPlayer().position.x - 50) {
            // 停在玩家前面，顯示情境題
            flowerSellerX = playerController.getPlayer().position.x - 50;
            showQaQuestion = true;

            setTimeout(() => {
              eventManager.successEvent(EVENT_QA_FLOWER_SELLER);
              showQaQuestion = false;
            }, 2000);
          }
        }

        playerController.draw(); // 畫玩家

        // 在這畫圖會蓋在 player 上面！
        if (successVio_RedLineParking) {
          violationManager.draw("redLineParking", showImgAndText);
          setTimeout(() => {
            successVio_RedLineParking = false;
          }, 2000);
        }

        if (showQaQuestion) {
          questionManager.draw({
            greeting:
              "來呦，買一朵玉蘭花吧！ 蝦米？你叫我走開？ 那先回答我的問題吧！",
          });
        }
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
