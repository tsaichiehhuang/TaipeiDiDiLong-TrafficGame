const Section2 = () => {
    // 在 Section 內部宣告的區域變數，只能在這個範圍內存取
    let sectionVariable = 'This is a variable in Section2 scope';

    // get car position y when each event start
    let startPosiY;
    let startPosiY_buyDrink;

    let showImgAndText;

    // double parking violation success var
    let successVio_DoubleParking = false;
    // buy drink success var
    let successVio_BuyDrink = false;

    return {
        preload: () => {
            // Called in p5.js preload() function
            console.log("Section 2 preload");

            // load event image
            this._doubleParkingVio = loadImage("../images/road/Wrong2.png");
            this._parkingSpace = loadImage("../images/road/Wrong3&4.png");
            this._explosion = loadImage("../images/explosion.png");
            this._buyDrinkSuccess = loadImage("../images/section2/Buy_Drink.png");
        },

        onSectionStart: () => {
            // Demo start event
            eventManager.startEvent(EVENT_REPORT_DOUBLE_PARKING, 1000);

            // 檢舉：並排停車
            eventManager.listen(EVENT_REPORT_DOUBLE_PARKING, (status) => {
                console.log("double parking event : " + status);
                switch (status) {
                    case EventStatus.START:
                        // get car y position when double parking status is start
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
                        console.log("double parking Event End, Report Fail!");
                        break;
                }
            });

            //關卡：停車買飲料
            eventManager.listen(EVENT_LEVEL_BUY_DRINK, (status) => {
                console.log("Buy drink event : " + status);
                switch (status) {
                    case EventStatus.START:
                        // get car y position when buy drink event status is start
                        startPosiY_buyDrink = playerController.getPlayer().position.y;
                        break;
                    case EventStatus.SUCCESS:
                        // Do something
                        console.log("Buy drink success!");
                        gameManager.nextSectionAfterScreenHeight();
                        break;
                    case EventStatus.FAIL:
                        // Do something
                        console.log("Buy drink fail!");
                        break;
                }
            });
        },

        draw: () => {
            // 不管哪個 section，都會執行
            // 原本的 drawAlways()
            // 在這畫圖會畫在 player 底下！

            // trigger double parking img
            image(
                this._doubleParkingVio,
                gameManager.getStreetXRange()[1] - this._doubleParkingVio.width - 10,
                startPosiY - 1600
            );

            // trigger parking space img
            image(this._parkingSpace, gameManager.getRoadXRange()[1] - 10, startPosiY_buyDrink - 900);

            // --------  原本的 drawDuringSection() ----------------
            // 這裡的程式碼只會在第 2 段執行
            if (gameManager.getSection() == 2) {
                console.log('Section 2 draw');
                const currentEvents = eventManager.getCurrentEvent();

                // Report on time or not when double parking event start
                if (currentEvents.has(EVENT_REPORT_DOUBLE_PARKING)) {
                    if (keyIsDown(32)) {
                        eventManager.successEvent(EVENT_REPORT_DOUBLE_PARKING);
                        showImgAndText = true;
                        successVio_DoubleParking = true;
                    } else if (
                        playerController.getPlayer().position.y - playerController.playerHeight <
                        startPosiY - 800
                    ) {
                        eventManager.endEvent(EVENT_REPORT_DOUBLE_PARKING);
                        eventManager.startEvent(EVENT_LEVEL_BUY_DRINK, 7000);
                    }
                }

                // Buy drink event
                if (currentEvents.has(EVENT_LEVEL_BUY_DRINK)) {
                    let maxRoadX = gameManager.getStreetXRange()[1] - playerController.playerWidth / 2;
                    // 限制玩家移動範圍 - 右側
                    if (playerController.getPlayer().position.x > maxRoadX) {
                        playerController.getPlayer().position.x = maxRoadX;
                        image(this._explosion, gameManager.getStreetXRange()[1] - playerController.playerWidth / 2, playerController.getPlayer().position.y - playerController.playerHeight / 2, 100, 100);
                    }
                    // 限制玩家移動範圍 - 上方
                    if (playerController.getPlayer().position.y < startPosiY_buyDrink - 580 && playerController.getPlayer().position.x > gameManager.getRoadXRange()[1] &&
                        playerController.getPlayer().position.x < gameManager.getStreetXRange()[1]) {
                        playerController.getPlayer().position.y = startPosiY_buyDrink - 580;
                        image(this._explosion, playerController.getPlayer().position.x - playerController.getPlayer().width / 2, startPosiY_buyDrink - 720, 100, 100);
                    }
                    // 限制玩家移動範圍 - 下方
                    if (playerController.getPlayer().position.y + playerController.playerHeight > startPosiY_buyDrink - 330 && playerController.getPlayer().position.x > gameManager.getRoadXRange()[1] &&
                        playerController.getPlayer().position.x < gameManager.getStreetXRange()[1]) {
                        playerController.getPlayer().position.y = startPosiY_buyDrink - 330 - playerController.playerHeight;
                        image(this._explosion, playerController.getPlayer().position.x - playerController.getPlayer().width / 2, startPosiY_buyDrink - 470, 100, 100);
                    }

                    // 判斷有沒有停在格子內
                    if (playerController.getPlayer().position.y > startPosiY_buyDrink - 580 &&
                        playerController.getPlayer().position.y + playerController.playerHeight < startPosiY_buyDrink - 360 &&
                        playerController.getPlayer().position.x > gameManager.getRoadXRange()[1] + playerController.playerWidth / 2 &&
                        playerController.getPlayer().position.x < maxRoadX) {
                        eventManager.successEvent(EVENT_LEVEL_BUY_DRINK);
                        successVio_BuyDrink = true;
                    }
                }

                // 在這畫圖會畫在 player 底下！
                playerController.draw(); // 畫玩家

                // 在這畫圖會蓋在 player 上面！
                // double parking
                if (successVio_DoubleParking) {
                    violationManager.draw("doubleParking", showImgAndText);
                    setTimeout(() => {
                        successVio_DoubleParking = false;
                    }, 2000);
                    eventManager.startEvent(EVENT_LEVEL_BUY_DRINK, 7000);
                }

                // buy drink
                if (successVio_BuyDrink) {
                    let xCurrPosi = (gameManager.getRoadXRange()[0] + gameManager.getRoadXRange()[1]) / 2;
                    let yCurrPosi = (gameManager.getVisibleYRange()[0] + gameManager.getVisibleYRange()[1]) / 2;
                    imageMode(CENTER); // 把圖的正中央當定位點
                    image(this._buyDrinkSuccess, xCurrPosi, yCurrPosi);
                    setTimeout(() => {
                        successVio_BuyDrink = false;
                    }, 2000);
                }

            }

            // 不管哪個 section，都會執行
            // 在這畫圖會蓋在 player 上面！
        },

        onSectionEnd: () => {
            console.log("Section 2 end");
            // 可能結束所有此 section 的事件
            // 或是 trigger 下一階段的事件

            eventManager.clearListeners([
                EVENT_REPORT_DOUBLE_PARKING,
                EVENT_LEVEL_BUY_DRINK
            ]);
        }
    };
};
