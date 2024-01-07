const Section5 = () => {
    // get car position y when EVENT_REPORT_RUNNING_RED_LIGHT start
    let startPosiY;

    // running red light violation success var
    let successVio_RunningRedLight = false;

    let runningRedLightCar = new RunningRedLightCar(0, 0);

    // red light success and image position
    let trafficLightImg;
    let trafficLightY;
    let showTrafficLight = false;
    let showTrafficLightText = false;
    let isStoppedBeforeTrafficLight = false;
    let hasStoppedAtRedLight = false;

    return {
        preload: () => {
            // Called in p5.js preload() function
            console.log("Section 5 preload");

            // load running red light violation img
            this._redLightImg = loadImage("../images/traffic light/Red.png");
            this._yellowLightImg = loadImage(
                "../images/traffic light/Yellow.png"
            );
            this._greenLightImg = loadImage(
                "../images/traffic light/Green.png"
            );

            this._scooterImg = loadImage(
                "../images/objects/scooter/Scooter_2.png"
            );
        },

        onSectionStart: () => {
            eventManager.startEvent(EVENT_LEVEL_TRAFFIC_LIGHT, 1500);

            //紅綠燈事件
            eventManager.listen(EVENT_LEVEL_TRAFFIC_LIGHT, (status) => {
                console.log("Traffic light event : " + status);
                switch (status) {
                    case EventStatus.START:
                        if (!hasStoppedAtRedLight) {
                            trafficLightY =
                                playerController.getPlayer().position.y - 950;
                            trafficLightManager.setup();
                            showTrafficLight = true;
                            setTimeout(() => {
                                trafficLightImg = this._yellowLightImg;
                            }, 1000);
                            setTimeout(() => {
                                trafficLightImg = this._redLightImg;
                            }, 2000);
                        } else {
                            hasStoppedAtRedLight = false;
                        }
                        break;
                    case EventStatus.SUCCESS:
                        isStoppedBeforeTrafficLight = true;
                        hasStoppedAtRedLight = true;
                        setTimeout(() => {
                            showTrafficLightText = true;
                        }, 800);
                        setTimeout(() => {
                            trafficLightImg = this._greenLightImg;
                        }, 5500);
                        eventManager.startEvent(
                            EVENT_REPORT_RUNNING_RED_LIGHT,
                            2000
                        );
                        console.log("Traffic light Success!");
                        break;
                    case EventStatus.FAIL:
                        isStoppedBeforeTrafficLight = false;
                        playerData.addTrafficTicket("闖紅燈", 1800);
                        setTimeout(() => {
                            showTrafficLightText = true;
                        }, 800);
                        setTimeout(() => {
                            trafficLightImg = this._greenLightImg;
                        }, 3000);
                        console.log("Traffic light Fail!");
                        setTimeout(() => {
                            gameManager.nextSectionAfterScreenHeight();
                        }, 1000);
                        break;
                }
            });

            // 檢舉：闖紅燈
            eventManager.listen(EVENT_REPORT_RUNNING_RED_LIGHT, (status) => {
                console.log("Running Red Light Event : " + status);
                switch (status) {
                    case EventStatus.START:
                        crosswalkPosY = player.position.y + 500;
                        let [endX, startX] = gameManager.getRoadXRange();
                        runningRedLightCar.setup(
                            (startX + endX) / 2,
                            crosswalkPosY,
                            crosswalkPosY - 2000,
                            this._scooterImg,
                            true
                        );
                        setTimeout(() => {
                            trafficLightImg = this._greenLightImg;
                        }, 5000);
                        break;
                    case EventStatus.SUCCESS:
                        // Do something
                        console.log("Report Success!");
                        setTimeout(() => {
                            gameManager.nextSectionAfterScreenHeight();
                        }, 1000);
                        break;
                    case EventStatus.FAIL:
                        // Do something
                        console.log("Report Fail!");
                        break;
                    case EventStatus.END:
                        // Do something
                        console.log("Running red light Event End!");
                        setTimeout(() => {
                            gameManager.nextSectionAfterScreenHeight();
                        }, 2000);
                        break;
                }
            });
        },

        draw: () => {
            // --------  原本的 drawAlways() ----------------
            // 不管哪個 section，都會執行
            // 在這畫圖會畫在 player 底下！

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
            // 這裡的程式碼只會在第 5 段執行
            if (gameManager.getSection() == 5) {
                console.log("Section 5 draw");
                const currentEvents = eventManager.getCurrentEvent();

                // Traffic light event
                const isPlayerStopped =
                    playerController.getPlayer().velocity.y === 0;
                if (currentEvents.has(EVENT_LEVEL_TRAFFIC_LIGHT)) {
                    if (isPlayerStopped) {
                        if (
                            playerController.getPlayer().position.y + 50 <
                                trafficLightY + 550 &&
                            playerController.getPlayer().position.y +
                                playerController.getPlayer().height / 2 <
                                50
                        ) {
                            eventManager.successEvent(
                                EVENT_LEVEL_TRAFFIC_LIGHT
                            );
                        }
                        if (
                            playerController.getPlayer().position.y + 50 <
                            trafficLightY + 370
                        ) {
                            eventManager.failEvent(EVENT_LEVEL_TRAFFIC_LIGHT);
                        }
                    } else if (
                        playerController.getPlayer().position.y + 50 <
                        trafficLightY + 370
                    ) {
                        eventManager.failEvent(EVENT_LEVEL_TRAFFIC_LIGHT);
                    }
                }

                if (hasStoppedAtRedLight && !isPlayerStopped) {
                    if (
                        playerController.getPlayer().position.y + 50 <
                            trafficLightY + 370 &&
                        trafficLightImg === this._redLightImg
                    ) {
                        eventManager.startEvent(EVENT_LEVEL_TRAFFIC_LIGHT, 0);
                        eventManager.failEvent(EVENT_LEVEL_TRAFFIC_LIGHT);
                    }
                }

                // Report on time or not when running red light event start
                if (currentEvents.has(EVENT_REPORT_RUNNING_RED_LIGHT)) {
                    if (keyIsDown(32)) {
                        eventManager.successEvent(
                            EVENT_REPORT_RUNNING_RED_LIGHT
                        );
                        showImgAndText = true;
                        successVio_RunningRedLight = true;
                    } else if (
                        //  在車子消失或是變綠燈就算檢舉失敗
                        trafficLightImg == this._greenLightImg || //綠燈
                        runningRedLightCar.sprite.position.y +
                            this._scooterImg.height <
                            gameManager.getVisibleYRange()[0] - 100
                    ) {
                        eventManager.endEvent(EVENT_REPORT_RUNNING_RED_LIGHT);
                    }
                }

                sparkController.drawExistingSparks(); // 畫碰撞的火花
                playerController.draw(); // 畫玩家

                runningRedLightCar.draw();

                // 在這畫圖會蓋在 player 上面！
                if (showTrafficLightText) {
                    trafficLightManager.draw(
                        isStoppedBeforeTrafficLight ? "stopped" : "notStopped"
                    );

                    setTimeout(() => {
                        showTrafficLightText = false;
                    }, 3000);
                }

                // Break out the game when report success
                if (successVio_RunningRedLight) {
                    violationManager.draw("runningRedLight");
                    setTimeout(() => {
                        successVio_RunningRedLight = false;
                        keyPressedManager.setKeyPressedStop(false);
                    }, 2000);
                }
            }

            // 不管哪個 section，都會執行
            // 在這畫圖會蓋在 player 上面！
        },

        onSectionEnd: () => {
            console.log("The game end");
            // 可能結束所有此 section 的事件
            // 或是 trigger 下一階段的事件

            // 清除之後不會再用到的事件 listener
            eventManager.clearListeners([
                EVENT_LEVEL_TRAFFIC_LIGHT,
                EVENT_REPORT_RUNNING_RED_LIGHT,
            ]);
        },
    };
};
