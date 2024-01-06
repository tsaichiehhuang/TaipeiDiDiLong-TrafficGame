const Section4 = () => {
    // 在 Section 內部宣告的區域變數，只能在這個範圍內存取
    let sectionVariable = "This is a variable in Section4 scope";

    // get car position y when each event start
    let startPosiY;
    let startPosiY_buyDinner;

    let showImgAndText;
    let successVio_crossHatchParking = false;
    let successVio_BuyDinner = false;

    return {
        preload: () => {
            // Called in p5.js preload() function
            console.log("Section 4 preload");

            // load evnet image
            this._crossHatchParkingVio = loadImage("../images/road/Wrong5.png");
            this._parkingSpace = loadImage("../images/road/Wrong3&4.png");
            this._buyDinnerSuccess = loadImage(
                "../images/section4/Buy_food.png"
            );
        },

        onSectionStart: () => {
            eventManager.startEvent(EVENT_REPORT_CROSS_HATCH_PARKING, 1000);

            // 檢舉：網狀線停車
            eventManager.listen(EVENT_REPORT_CROSS_HATCH_PARKING, (status) => {
                console.log("cross hatch parking event : " + status);
                switch (status) {
                    case EventStatus.START:
                        // get car y position when double parking status is start
                        startPosiY = playerController.getPlayer().position.y;
                        let violationSprite = new Sprite(
                            gameManager.getRoadXRange()[0] + this._crossHatchParkingVio.width /2,
                            startPosiY - 585 + this._crossHatchParkingVio.height /2,
                            this._crossHatchParkingVio.width - 50,
                            this._crossHatchParkingVio.height - 100,
                            'static');
                        violationSprite.visible = false;
                        registerSparkWhenCollide(violationSprite, sparkController);
                        break;
                    case EventStatus.SUCCESS:
                        // Do something
                        console.log("Report Success!");
                        eventManager.startEvent(EVENT_LEVEL_BUY_DINNER, 7000);
                        break;
                    case EventStatus.FAIL:
                        // Do something
                        console.log("Report Fail!");
                        break;
                    case EventStatus.END:
                        // Do something
                        console.log("cross hatch parking Event End!");
                        break;
                }
            });

            //關卡：停車買飲料
            eventManager.listen(EVENT_LEVEL_BUY_DINNER, (status) => {
                console.log("Buy dinner event : " + status);
                switch (status) {
                    case EventStatus.START:
                        // get car y position when buy drink event status is start
                        startPosiY_buyDinner =
                            playerController.getPlayer().position.y;
                        mainUIController.setTaskText(
                            "請將車子停入右方停車格，完成購買便當的任務！"
                        );
                        break;
                    case EventStatus.SUCCESS:
                        // Do something
                        console.log("Buy dinner success!");
                        gameManager.nextSectionAfterScreenHeight();
                        break;
                    case EventStatus.FAIL:
                        // Do something
                        console.log("Buy dinner fail!");
                        break;
                }
            });
        },

        draw: () => {
            // 不管哪個 section，都會執行
            // 原本的 drawAlways()
            // 在這畫圖會畫在 player 底下！

            // trigger cross hatch parking img
            image(
                this._crossHatchParkingVio,
                gameManager.getRoadXRange()[0] + 12,
                startPosiY - 600
            );

            // trigger parking space img
            image(
                this._parkingSpace,
                gameManager.getRoadXRange()[1] - 10,
                startPosiY_buyDinner - 900
            );

            // --------  原本的 drawDuringSection() ----------------
            // 這裡的程式碼只會在第 4 段執行
            if (gameManager.getSection() == 4) {
                console.log("Section 4 draw");
                const currentEvents = eventManager.getCurrentEvent();

                // Report on time or not when cross hatch parking event start
                if (currentEvents.has(EVENT_REPORT_CROSS_HATCH_PARKING)) {
                    if (keyIsDown(32)) {
                        allSounds.get("photo").play();
                        eventManager.successEvent(
                            EVENT_REPORT_CROSS_HATCH_PARKING
                        );
                        showImgAndText = true;
                        successVio_crossHatchParking = true;
                    } else if (
                        playerController.getPlayer().position.y -
                            playerController.playerHeight <
                        startPosiY - 900
                    ) {
                        eventManager.endEvent(EVENT_REPORT_CROSS_HATCH_PARKING);
                        if(!currentEvents.has(EVENT_LEVEL_BUY_DRINK)) {
                            eventManager.startEvent(EVENT_LEVEL_BUY_DINNER, 7000);
                        }
                    }
                }

                // Buy dinner event
                if (currentEvents.has(EVENT_LEVEL_BUY_DINNER)) {
                    let maxRoadX =
                        gameManager.getStreetXRange()[1] -
                        playerController.playerWidth / 2;
                    // 限制玩家移動範圍 - 右側
                    if (playerController.getPlayer().position.x > maxRoadX) {
                        playerController.getPlayer().position.x = maxRoadX;
                        sparkController.createSpark(
                            gameManager.getStreetXRange()[1],
                            playerController.getPlayer().position.y
                        );
                    }
                    // 限制玩家移動範圍 - 上方
                    if (
                        playerController.getPlayer().position.y <
                            startPosiY_buyDinner - 580 &&
                        playerController.getPlayer().position.x >
                            gameManager.getRoadXRange()[1] &&
                        playerController.getPlayer().position.x <
                            gameManager.getStreetXRange()[1]
                    ) {
                        playerController.getPlayer().position.y =
                            startPosiY_buyDinner - 580;
                        sparkController.createSpark(
                            playerController.getPlayer().position.x,
                            startPosiY_buyDinner - 650
                        );
                    }
                    // 限制玩家移動範圍 - 下方
                    if (
                        playerController.getPlayer().position.y +
                            playerController.playerHeight >
                            startPosiY_buyDinner - 330 &&
                        playerController.getPlayer().position.x >
                            gameManager.getRoadXRange()[1] &&
                        playerController.getPlayer().position.x <
                            gameManager.getStreetXRange()[1]
                    ) {
                        playerController.getPlayer().position.y =
                            startPosiY_buyDinner -
                            330 -
                            playerController.playerHeight;
                        sparkController.createSpark(
                            playerController.getPlayer().position.x,
                            startPosiY_buyDinner - 400
                        );
                    }

                    // 判斷有沒有停在格子內
                    if (
                        playerController.getPlayer().position.y >
                            startPosiY_buyDinner - 580 &&
                        playerController.getPlayer().position.y +
                            playerController.playerHeight <
                            startPosiY_buyDinner - 360 &&
                        playerController.getPlayer().position.x >
                            gameManager.getRoadXRange()[1] +
                                playerController.playerWidth / 2 &&
                        playerController.getPlayer().position.x < maxRoadX
                    ) {
                        allSounds.get("buy").play();
                        eventManager.successEvent(EVENT_LEVEL_BUY_DINNER);
                        successVio_BuyDinner = true;
                    }
                }

                // 在這畫圖會畫在 player 底下！
                sparkController.drawExistingSparks(); // 畫碰撞的火花
                playerController.draw(); // 畫玩家

                // 在這畫圖會蓋在 player 上面！
                // cross hatch parking
                if (successVio_crossHatchParking) {
                    violationManager.draw("crossHatchParking", showImgAndText);
                    setTimeout(() => {
                        successVio_crossHatchParking = false;
                        keyPressedManager.setKeyPressedStop(false);
                    }, 2000);
                }

                // buy dinner
                if (successVio_BuyDinner) {
                    let xCurrPosi =
                        (gameManager.getRoadXRange()[0] +
                            gameManager.getRoadXRange()[1]) /
                        2;
                    let yCurrPosi =
                        (gameManager.getVisibleYRange()[0] +
                            gameManager.getVisibleYRange()[1]) /
                        2;
                    imageMode(CENTER); // 把圖的正中央當定位點
                    image(this._buyDinnerSuccess, xCurrPosi, yCurrPosi);
                    keyPressedManager.setKeyPressedStop(true);
                    setTimeout(() => {
                        successVio_BuyDinner = false;
                        keyPressedManager.setKeyPressedStop(false);
                    }, 2000);
                    playerController.getPlayer().position.x = width/2 + (gameManager.getRoadXRange()[1] - width / 2) / 2;
                    mainUIController.setTaskText("");
                }
            }

            // 不管哪個 section，都會執行
            // 在這畫圖會蓋在 player 上面！
        },

        onSectionEnd: () => {
            console.log("Section 4 end");
            // 可能結束所有此 section 的事件
            // 或是 trigger 下一階段的事件

            eventManager.clearListeners([EVENT_REPORT_CROSS_HATCH_PARKING]);
        },
    };
};
