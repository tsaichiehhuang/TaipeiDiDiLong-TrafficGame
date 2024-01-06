// A demo of section
const Section1 = () => {
    // get car position y when EVENT_REPORT_RED_LINE_PARKING start
    let startPosiY;

    // red line violation success var
    let successVio_RedLineParking = false;

    let showImgAndText;

    // red light success and image position
    let trafficLightImg;
    let trafficLightY;
    let showTrafficLight = false;
    let showTrafficLightText = false;
    let isStoppedInRedLight = false;

    let flowerSellerY;
    let showSeller = false;
    let showQaQuestion = false;
    let qaResult = null;

    let scooter = new Scooter();

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
            mainUIController.setTaskText("下一個任務：買飲料\n請繼續直行");

            eventManager.startEvent(EVENT_REPORT_RED_LINE_PARKING, 3500); // start after 4 second

            // 檢舉：紅線停車
            eventManager.listen(EVENT_REPORT_RED_LINE_PARKING, (status) => {
                console.log("Red line event : " + status);
                switch (status) {
                    case EventStatus.START:
                        // get car y position when red line parking status is start
                        startPosiY = playerController.getPlayer().position.y;
                        let violationSprite = new Sprite(
                            gameManager.getRoadXRange()[0] + this._redLineVio.width /2,
                            startPosiY - 900 + this._redLineVio.height /2,
                            this._redLineVio.width,
                            this._redLineVio.height - 100,
                            'static');
                        violationSprite.visible = false;
                        registerSparkWhenCollide(violationSprite, sparkController);
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
                        console.log("Red Line Event End!");
                        break;
                }
            });
            

            //紅綠燈事件
            eventManager.listen(EVENT_LEVEL_TRAFFIC_LIGHT, (status) => {
                console.log("Traffic light event : " + status);
                switch (status) {
                    case EventStatus.START:
                        trafficLightY =
                            playerController.getPlayer().position.y - 950;
                        trafficLightManager.setup();
                        showTrafficLight = true;
                        setTimeout(() => {
                            trafficLightImg = this._yellowLightImg;
                            // 設定夠快的速度，可以在紅燈前過去
                            // 設定起始點：當時的摩托車位置，目標位置：紅燈位置再上去一點，時間：1秒
                            scooter.updateSpeed(computeSpeed(scooter.sprite.position.y, trafficLightY - 200, 1));
                        }, 1000);
                        setTimeout(() => {
                            trafficLightImg = this._redLightImg;
                        }, 2000);
                        break;
                    case EventStatus.SUCCESS:
                        isStoppedInRedLight = true;
                        setTimeout(() => {
                            showTrafficLightText = true;
                        }, 800);
                        eventManager.startEvent(EVENT_QA_FLOWER_SELLER, 750);
                        console.log("Traffic light Success!");
                        break;
                    case EventStatus.FAIL:
                        isStoppedInRedLight = false;
                        playerData.addTrafficTicket("闖紅燈", 1800);
                        setTimeout(() => {
                            showTrafficLightText = true;
                        }, 800);
                        setTimeout(() => {
                            trafficLightImg = this._greenLightImg;
                        }, 3000);
                        console.log("Traffic light Fail!");
                        gameManager.nextSectionAfterScreenHeight();
                        break;
                }
            });

            // 玉蘭花情境事件
            eventManager.listen(EVENT_QA_FLOWER_SELLER, (status) => {
                console.log("Flower seller event : " + status);
                switch (status) {
                    case EventStatus.START:
                        const visibleRange = gameManager.getVisibleYRange();
                        flowerSellerY = visibleRange[0];
                        keyPressedManager.setKeyPressedStop(true);
                        showSeller = true;
                        questionManager.setup();
                        setTimeout(() => {
                            questionManager.getRandomQuestion(
                                EVENT_QA_FLOWER_SELLER
                            );
                            showQaQuestion = true;
                        }, 3500);
                        break;
                    case EventStatus.SUCCESS:
                        showSeller = false;
                        showQaQuestion = false;
                        qaResult = true;
                        setTimeout(() => {
                            qaResult = null;
                        }, 3000);
                        setTimeout(() => {
                            trafficLightImg = this._greenLightImg;
                            keyPressedManager.setKeyPressedStop(false);
                        }, 4500);
                        console.log("Flower seller Success!");
                        gameManager.nextSectionAfterScreenHeight();
                        break;
                    case EventStatus.FAIL:
                        showSeller = false;
                        showQaQuestion = false;
                        qaResult = false;
                        setTimeout(() => {
                            qaResult = null;
                        }, 3500);
                        setTimeout(() => {
                            trafficLightImg = this._greenLightImg;
                            keyPressedManager.setKeyPressedStop(false);
                        }, 4500);
                        console.log("Flower seller Fail!");
                        gameManager.nextSectionAfterScreenHeight();
                        break;
                }
            });

            scooter.setup(player.position.x , player.position.y - 200);

            
        },

        draw: () => {
            // 不管哪個 section，都會執行
            // 原本的 drawAlways()
            // 在這畫圖會畫在 player 底下！

            // trigger red line parking img
            image(
                this._redLineVio,
                gameManager.getRoadXRange()[0] + 8,
                startPosiY - 900
            );

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

            // --------  原本的 drawDuringSection() ----------------
            // 這裡的程式碼只會在第 1 段執行
            if (gameManager.getSection() == 1) {
                console.log("Section 1 draw");
                const currentEvents = eventManager.getCurrentEvent();

                // Report on time or not when red line parking event start
                if (currentEvents.has(EVENT_REPORT_RED_LINE_PARKING)) {
                    if (keyIsDown(32)) {
                        allSounds.get("photo").play();
                        eventManager.successEvent(
                            EVENT_REPORT_RED_LINE_PARKING
                        );
                        showImgAndText = true;
                        successVio_RedLineParking = true;
                        eventManager.startEvent(
                            EVENT_LEVEL_TRAFFIC_LIGHT,
                            6500
                        );
                    } else if (
                        playerController.getPlayer().position.y -
                            playerController.playerHeight <
                        startPosiY - 900
                    ) {
                        eventManager.endEvent(EVENT_REPORT_RED_LINE_PARKING);
                        eventManager.startEvent(
                            EVENT_LEVEL_TRAFFIC_LIGHT,
                            3500
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

                sparkController.drawExistingSparks(); // 畫碰撞的火花
                playerController.draw(); // 畫玩家
                scooter.draw(); // 畫摩托車

                // 在這畫圖會蓋在 player 上面！
                if (successVio_RedLineParking) {
                    violationManager.draw("redLineParking", showImgAndText);
                    setTimeout(() => {
                        successVio_RedLineParking = false;
                        keyPressedManager.setKeyPressedStop(false);
                    }, 2000);
                }

                if (showTrafficLightText) {
                    trafficLightManager.draw(
                        isStoppedInRedLight ? "stopped" : "notStopped"
                    );

                    setTimeout(() => {
                        showTrafficLightText = false;
                    }, 3000);
                }

                if (showQaQuestion) {
                    questionManager.showQuestion({
                        greeting:
                            "來呦，買一朵玉蘭花吧！ 蝦米？你叫我走開？ 那先回答我的問題吧！",
                    });
                }

                if (qaResult !== null) {
                    questionManager.showResult(qaResult);
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

            scooter.removeSprite();
            scooter = null;
        },
    };
};
