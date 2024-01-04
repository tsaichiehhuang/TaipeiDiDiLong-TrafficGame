const Section3 = () => {
    // 在 Section 內部宣告的區域變數，只能在這個範圍內存取
    let sectionVariable = 'This is a variable in Section3 scope';

    let startPosiY_crossTheRoad;
    let startPosiY;
    let successVio_notYieldPerson = false;
    let showImgAndText;
    let showLevelText = false;
    let isStoppedInLevel;

    return {
        preload: () => {
            // Called in p5.js preload() function
            console.log("Section 3 preload")

            // load event image
            this._crossTheRoad = loadImage("../images/section3/Walk.gif");
            this._notYieldPerson = loadImage("../images/section3/3.gif");
        },

        onSectionStart: () => {
            eventManager.startEvent(EVENT_LEVEL_CROSS_THE_ROAD, 1500);

            // 關卡：行人過馬路
            eventManager.listen(EVENT_LEVEL_CROSS_THE_ROAD, (status) => {
                console.log("Cross the roas event : " + status);
                switch (status) {
                    case EventStatus.START:
                        startPosiY_crossTheRoad = playerController.getPlayer().position.y;
                        break;
                    case EventStatus.SUCCESS:
                        isStoppedInLevel = true;
                        setTimeout(() => {
                            showLevelText = true;
                        },1000);
                        console.log("Cross the road success");
                        eventManager.startEvent(EVENT_REPORT_NOT_YIELDING_TO_PEDESTRIANS, 4000);
                        break;
                    case EventStatus.FAIL:
                        isStoppedInLevel = false;
                        showLevelText = true;
                        console.log("Cross the road fail");
                        eventManager.startEvent(EVENT_REPORT_NOT_YIELDING_TO_PEDESTRIANS, 4000);
                        break;
                }
            });

            // 檢舉：未禮讓行人
            eventManager.listen(EVENT_REPORT_NOT_YIELDING_TO_PEDESTRIANS, (status) => {
                console.log("Not yielding to pedestrian event : " + status);
                switch (status) {
                    case EventStatus.START:
                        startPosiY = playerController.getPlayer().position.y;
                        break;
                    case EventStatus.SUCCESS:
                        // Do something
                        console.log("Report Success!");
                        gameManager.nextSectionAfterScreenHeight();
                        break;
                    case EventStatus.FAIL:
                        // Do something
                        console.log("Report Fail!");
                        break;
                    case EventStatus.END:
                        // Do something
                        console.log("not yield person Event End, Report Fail!");
                        gameManager.nextSectionAfterScreenHeight();
                        break;
                }
            });


        },

        draw: () => {

            // 不管哪個 section，都會執行
            // 原本的 drawAlways()
            // 在這畫圖會畫在 player 底下！

            image(this._crossTheRoad, gameManager.getStreetXRange()[0] + 6, startPosiY_crossTheRoad  - 1000);

            image(this._notYieldPerson, gameManager.getStreetXRange()[0] + 8, startPosiY - 1500);

            if (gameManager.getSection() == 3) {
                // 原本的 drawDuringSection()
                // 這裡的程式碼只會在第 3 段執行
                console.log('Section 3 draw');
                const currentEvents = eventManager.getCurrentEvent();

                if (currentEvents.has(EVENT_LEVEL_CROSS_THE_ROAD)) {
                    const isPlayerStopped = playerController.getPlayer().velocity.y === 0;

                    if (isPlayerStopped) {
                        if (playerController.getPlayer().position.y + playerController.playerHeight < startPosiY_crossTheRoad - 1000 + (this._crossTheRoad.height * 3) &&
                            playerController.getPlayer().position.y > startPosiY_crossTheRoad - 1000 +  this._crossTheRoad.height) {
                            eventManager.successEvent(EVENT_LEVEL_CROSS_THE_ROAD);
                        } 
                    }else if (playerController.getPlayer().position.y + playerController.playerHeight < startPosiY_crossTheRoad - 1000) {
                            eventManager.failEvent(EVENT_LEVEL_CROSS_THE_ROAD);
                    }
                }

                if (showLevelText) {
                    crossTheRoadManager.draw(isStoppedInLevel ? "stopped" : "notStopped");
                    setTimeout(() => {
                        showLevelText = false;
                    }, 2000);
                }

                // Report on time or not when red line parking event start
                if (currentEvents.has(EVENT_REPORT_NOT_YIELDING_TO_PEDESTRIANS)) {
                    if (keyIsDown(32)) {
                        eventManager.successEvent(EVENT_REPORT_NOT_YIELDING_TO_PEDESTRIANS);
                        showImgAndText = true;
                        successVio_notYieldPerson = true;
                    } else if (
                        playerController.getPlayer().position.y + playerController.playerHeight < startPosiY - 1500
                    ) {
                        eventManager.endEvent(EVENT_REPORT_NOT_YIELDING_TO_PEDESTRIANS);
                    }
                }

                // 在這畫圖會畫在 player 底下！
                playerController.draw(); // 畫玩家

                // 在這畫圖會蓋在 player 上面！
                if (successVio_notYieldPerson) {
                    violationManager.draw("notYieldPerson", showImgAndText);
                    setTimeout(() => {
                        successVio_notYieldPerson = false;
                        keyPressedManager.setKeyPressedStop(false);
                    }, 2000);
                }
            }

            // 不管哪個 section，都會執行
            // 在這畫圖會蓋在 player 上面！
        },

        onSectionEnd: () => {
            console.log("Section 3 end");
            // 可能結束所有此 section 的事件
            // 或是 trigger 下一階段的事件

            // 清除之後不會再用到的事件 listener
            eventManager.clearListeners([
                EVENT_LEVEL_CROSS_THE_ROAD,
                EVENT_REPORT_NOT_YIELDING_TO_PEDESTRIANS,
            ]);
        }
    };
};
