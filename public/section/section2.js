const Section2 = () => {
    // 在 Section 內部宣告的區域變數，只能在這個範圍內存取
    let sectionVariable = 'This is a variable in Section2 scope';

    // get car position y when EVENT_REPORT_DOUBLE_PARKING start
    let startPosiY;

    let showImgAndText;

    // double parking violation success var
    let successVio_DoubleParking = false;

    return {
        preload: () => {
            // Called in p5.js preload() function
            console.log("Section 2 preload");

            // load event image
            this._doubleParkingVio = loadImage("../images/road/Wrong2.png");
        },

        onSectionStart: () => {
            // Demo start event
            eventManager.startEvent(EVENT_REPORT_DOUBLE_PARKING, 1000);
            eventManager.startEvent(EVENT_LEVEL_BUY_DRINK, 5000);

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
                    }
                }

                // 在這畫圖會畫在 player 底下！
                playerController.draw(); // 畫玩家

                // 在這畫圖會蓋在 player 上面！
                if (successVio_DoubleParking) {
                    violationManager.draw("doubleParking", showImgAndText);
                    setTimeout(() => {
                        successVio_DoubleParking = false;
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
                EVENT_REPORT_DOUBLE_PARKING
            ]);
        }
    };
};
