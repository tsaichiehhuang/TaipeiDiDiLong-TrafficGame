const Section5 = () => {
    // get car position y when EVENT_REPORT_RUNNING_RED_LIGHT start
    let startPosiY;

    // running red light violation success var
    let successVio_RunningRedLight = false;

    // report success var
    let showImgAndText;

    // red light success and image position
    let trafficLightImg;
    let trafficLightY;
    let showTrafficLight = false;
    let showRedLightText = false;
    let isStoppedInRedLight = false;

    return {
        preload: () => {
            // Called in p5.js preload() function

            // load running red light violation img
            this._redLightVio = loadImage("../images/redLineParking.jpeg");
            this._redLightImg = loadImage("../images/traffic light/Red.png");
            this._yellowLightImg = loadImage(
                "../images/traffic light/Yellow.png"
            );
            this._greenLightImg = loadImage(
                "../images/traffic light/Green.png"
            );
        },

        onSectionStart: () => {
            eventManager.startEvent(EVENT_LEVEL_TRAFFIC_LIGHT, 1500);

            //監聽紅綠燈事件
            eventManager.listen(EVENT_LEVEL_TRAFFIC_LIGHT, (status) => {
                console.log("Traffic light event : " + status);
                switch (status) {
                    case EventStatus.START:
                        trafficLightY =
                            playerController.getPlayer().position.y - 950;
                        runRedLightManager.setup();
                        showTrafficLight = true;
                        setTimeout(() => {
                            trafficLightImg = this._yellowLightImg;
                        }, 1000);
                        setTimeout(() => {
                            trafficLightImg = this._redLightImg;
                        }, 2000);
                        break;
                    case EventStatus.SUCCESS:
                        isStoppedInRedLight = true;
                        setTimeout(() => {
                            showRedLightText = true;
                        }, 800);
                        eventManager.startEvent(
                            EVENT_REPORT_RUNNING_RED_LIGHT,
                            3000
                        );
                        console.log("Traffic light Success!");
                        break;
                    case EventStatus.FAIL:
                        isStoppedInRedLight = false;
                        setTimeout(() => {
                            showRedLightText = true;
                        }, 800);

                        setTimeout(() => {
                            trafficLightImg = this._greenLightImg;
                        }, 3000);
                        console.log("Traffic light Fail!");
                        gameManager.nextSectionAfterScreenHeight();
                        break;
                }
            });

            // 檢舉：闖紅燈
            eventManager.listen(EVENT_REPORT_RUNNING_RED_LIGHT, (status) => {
                console.log("Running Red Light Event : " + status);
                switch (status) {
                    case EventStatus.START:
                        // get car y position when running red light status is start
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
                        console.log(
                            "Running red light Event End, Report Fail!"
                        );
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

            // trigger running red light img
            image(
                this._redLightVio,
                gameManager.getRoadXRange()[1] - this._redLightVio.width,
                startPosiY - 800
            );

            // --------  原本的 drawDuringSection() ----------------
            // 這裡的程式碼只會在第 5 段執行
            if (gameManager.getSection() == 5) {
                console.log("Section 5 draw");
                const currentEvents = eventManager.getCurrentEvent();

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

                // Report on time or not when running red light event start
                if (currentEvents.has(EVENT_REPORT_RUNNING_RED_LIGHT)) {
                    if (keyIsDown(32)) {
                        eventManager.successEvent(
                            EVENT_REPORT_RUNNING_RED_LIGHT
                        );
                        showImgAndText = true;
                        successVio_RunningRedLight = true;
                    } else if (
                        playerController.getPlayer().position.y -
                            playerController.playerHeight <
                        startPosiY - 800
                    ) {
                        eventManager.endEvent(EVENT_REPORT_RUNNING_RED_LIGHT);
                    }
                }

                // 在這畫圖會畫在 player 底下！
                sparkController.drawExistingSparks(); // 畫碰撞的火花
                playerController.draw(); // 畫玩家

                // 在這畫圖會蓋在 player 上面！

                // Break out the game when report success
                if (successVio_RunningRedLight) {
                    violationManager.draw("runningRedLight", showImgAndText);
                    setTimeout(() => {
                        successVio_RunningRedLight = false;
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
