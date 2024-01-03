// A demo of section
const Section1 = () => {
    // Demo walker a in section
    let walker1 = new Walker((startPosY = 100), "第一個行人");

    // get car position y when EVENT_REPORT_RED_LINE_PARKING start
    let startPosiY;

    // red line violation success var
    let successVio_RedLineParking = false;

    let showImgAndText;

    // red light success and image position
    let trafficLightImg;
    let trafficLightY;
    let showTrafficLight = false;
    let showRedLightText = false;
    let isStoppedInRedLight = false;

    let flowerSellerY;
    let showSeller = false;
    let showQaQuestion = false;

    return {
        preload: () => {
            // Called in p5.js preload() function
            console.log("Section 1 preload");

            // load red line parking violation img
            this._redLineVio = loadImage("../images/road/Wrong1.png");
            this._redLightImg = loadImage("../images/traffic light/Red.png");
            this._yellowLightImg = loadImage(
                "../images/traffic light/Yellow.png"
            );
            this._greenLightImg = loadImage(
                "../images/traffic light/Green.png"
            );
            this._crosswalkImg = loadImage("../images/road/Road_3.png");
            this._flowerSeller = loadImage("../images/section1/flower.gif");
        },

        onSectionStart: () => {
            walker1.setup(gameManager.getRoadXRange());

            // Demo start and success event
            eventManager.startEvent(EVENT_REPORT_RED_LINE_PARKING, 3500); // start after 4 second

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
                    case EventStatus.END:
                        // Do something
                        console.log("Red Line Event End, Report Fail!");
                        break;
                }
            });

            //監聽紅綠燈事件
            eventManager.listen(EVENT_LEVEL_TRAFFIC_LIGHT, (status) => {
                console.log("Traffic light event : " + status);
                switch (status) {
                    case EventStatus.START:
                        //紅綠燈位置會在玩家現在的位置的上方500
                        trafficLightY =
                            playerController.getPlayer().position.y - 950;

                        showTrafficLight = true;
                        setTimeout(() => {
                            trafficLightImg = this._yellowLightImg;
                        }, 1500);
                        setTimeout(() => {
                            trafficLightImg = this._redLightImg;
                        }, 3000);
                        break;
                    case EventStatus.SUCCESS:
                        // 停紅綠燈 0.5 秒後觸發玉蘭花情境題
                        isStoppedInRedLight = true;
                        setTimeout(() => {
                            showRedLightText = true;
                        }, 500);
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
                        gameManager.nextSectionAfterScreenHeight();
                        break;
                }
            });

            // 監聽玉蘭花情境題事件
            eventManager.listen(EVENT_QA_FLOWER_SELLER, (status) => {
                console.log("Flower seller event : " + status);
                switch (status) {
                    case EventStatus.START:
                        const visibleRange = gameManager.getVisibleYRange();
                        flowerSellerY = visibleRange[0];
                        showSeller = true;
                        questionManager.setup();
                        setTimeout(() => {
                            questionManager.getRandomQuestion();
                            showQaQuestion = true;
                        }, 3500);
                        break;
                    case EventStatus.SUCCESS:
                        showSeller = false;
                        showQaQuestion = false;
                        setTimeout(() => {
                            trafficLightImg = this._greenLightImg;
                        }, 500);
                        console.log("Flower seller Success!");
                        gameManager.nextSectionAfterScreenHeight();
                        break;
                    case EventStatus.FAIL:
                        showSeller = false;
                        showQaQuestion = false;
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

            // 玉蘭花阿婆
            if (showSeller) {
                image(this._flowerSeller, 0, flowerSellerY, 1280, 720);
            }

            // 紅綠燈＆斑馬線
            // 畫面上一開始先顯示綠燈圖片，紅燈事件觸發時才顯示紅燈圖片
            if (showTrafficLight) {
                image(this._crosswalkImg, 0, trafficLightY, 1280, 720);

                trafficLightImg = trafficLightImg || this._greenLightImg;
                image(
                    trafficLightImg,
                    gameManager.getRoadXRange()[1] / 2 + 25,
                    trafficLightY - 50,
                    375,
                    375
                );
            }

            // trigger red line parking img
            image(
                this._redLineVio,
                gameManager.getStreetXRange()[0] + 8,
                startPosiY - 900
            );

            // --------  原本的 drawDuringSection() ----------------
            // 這裡的程式碼只會在第 1 段執行
            if (gameManager.getSection() == 1) {
                console.log("Section 1 draw");
                const currentEvents = eventManager.getCurrentEvent();

                // Report on time or not when red line parking event start
                if (currentEvents.has(EVENT_REPORT_RED_LINE_PARKING)) {
                    if (keyIsDown(32)) {
                        eventManager.successEvent(
                            EVENT_REPORT_RED_LINE_PARKING
                        );
                        showImgAndText = true;
                        successVio_RedLineParking = true;
                    } else if (
                        playerController.getPlayer().position.y -
                            playerController.playerHeight <
                        startPosiY - 800
                    ) {
                        eventManager.endEvent(EVENT_REPORT_RED_LINE_PARKING);
                        eventManager.startEvent(
                            EVENT_LEVEL_TRAFFIC_LIGHT,
                            4000
                        );
                    }
                }

                // Traffic light event
                if (currentEvents.has(EVENT_LEVEL_TRAFFIC_LIGHT)) {
                    const isPlayerStopped =
                        playerController.getPlayer().velocity.y === 0;

                    if (isPlayerStopped) {
                        if (
                            playerController.getPlayer().position.y + 50 <
                                trafficLightY + 550 &&
                            playerController.getPlayer().position.y +
                                playerController.getPlayer().height / 2 <
                                50
                        )
                            eventManager.successEvent(
                                EVENT_LEVEL_TRAFFIC_LIGHT
                            );
                    } else if (
                        playerController.getPlayer().position.y + 50 <
                        trafficLightY
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
                if (successVio_RedLineParking) {
                    violationManager.draw("redLineParking", showImgAndText);
                    setTimeout(() => {
                        successVio_RedLineParking = false;
                    }, 2000);
                    eventManager.startEvent(EVENT_LEVEL_TRAFFIC_LIGHT, 4000);
                }

                if (showQaQuestion) {
                    questionManager.showQuestion({
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
