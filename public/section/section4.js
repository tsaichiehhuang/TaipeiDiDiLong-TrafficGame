const Section4 = () => {
    // 在 Section 內部宣告的區域變數，只能在這個範圍內存取
    let sectionVariable = 'This is a variable in Section4 scope';

    let startPosiY;
    let showImgAndText;
    let successVio_crossHatchParking = false;

    return {
        preload: () => {
            // Called in p5.js preload() function
            console.log("Section 4 preload");

            // load evnet image
            this._crossHatchParkingVio = loadImage("../images/road/Wrong5.png");
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
                        console.log("cross hatch parking Event End!");
                        break;
                }
            });
        },

        draw: () => {
            
            // 不管哪個 section，都會執行
            // 原本的 drawAlways()
            // 在這畫圖會畫在 player 底下！

            image(
                this._crossHatchParkingVio, gameManager.getRoadXRange()[0] + 12, startPosiY - 600);

            // --------  原本的 drawDuringSection() ----------------
            // 這裡的程式碼只會在第 4 段執行
            if(gameManager.getSection() == 4) {
                console.log('Section 4 draw');
                const currentEvents = eventManager.getCurrentEvent();

                if (currentEvents.has(EVENT_REPORT_CROSS_HATCH_PARKING)) {
                    if (keyIsDown(32)) {
                        eventManager.successEvent(EVENT_REPORT_CROSS_HATCH_PARKING);
                        showImgAndText = true;
                        successVio_crossHatchParking = true;
                    } else if (
                        playerController.getPlayer().position.y - playerController.playerHeight <
                        startPosiY - 900
                    ) {
                        eventManager.endEvent(EVENT_REPORT_CROSS_HATCH_PARKING);
                    }
                }

                // 在這畫圖會畫在 player 底下！
                sparkController.drawExistingSparks();  // 畫碰撞的火花
                playerController.draw(); // 畫玩家
                
                // 在這畫圖會蓋在 player 上面！
                if (successVio_crossHatchParking) {
                    violationManager.draw("crossHatchParking", showImgAndText);
                    setTimeout(() => {
                        successVio_crossHatchParking = false;
                        keyPressedManager.setKeyPressedStop(false);
                    }, 2000);
                }
            }

            // 不管哪個 section，都會執行
            // 在這畫圖會蓋在 player 上面！
        },

        onSectionEnd: () => {
            console.log("Section 4 end");
            // 可能結束所有此 section 的事件
            // 或是 trigger 下一階段的事件

            eventManager.clearListeners([
                EVENT_REPORT_CROSS_HATCH_PARKING
            ]);
        }
    };
};
