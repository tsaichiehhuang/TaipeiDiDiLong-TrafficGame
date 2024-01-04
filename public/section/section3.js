const Section3 = () => {
    // 在 Section 內部宣告的區域變數，只能在這個範圍內存取
    let sectionVariable = 'This is a variable in Section3 scope';

    let startPosiY_crossTheRoad;
    let showLevelText = false;
    let isStoppedInLevel;

    return {
        preload: () => {
            // Called in p5.js preload() function
            console.log("Section 3 preload")

            // load event image
            this._crossTheRoad = loadImage("../images/section3/Road_3.png");
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
                        gameManager.nextSectionAfterScreenHeight();
                        break;
                    case EventStatus.FAIL:
                        isStoppedInLevel = false;
                        showLevelText = true;
                        console.log("Cross the road fail");
                        gameManager.nextSectionAfterScreenHeight();
                        break;
                }
            });
        },

        draw: () => {

            // 不管哪個 section，都會執行
            // 原本的 drawAlways()
            // 在這畫圖會畫在 player 底下！

            image(this._crossTheRoad, gameManager.getRoadXRange()[0] + 7, startPosiY_crossTheRoad  - 1000);

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

                // 在這畫圖會畫在 player 底下！
                sparkController.drawExistingSparks();  // 畫碰撞的火花

                playerController.draw(); // 畫玩家

                // 在這畫圖會蓋在 player 上面！
                if (showLevelText) {
                    crossTheRoadManager.draw(isStoppedInLevel ? "stopped" : "notStopped");
                    setTimeout(() => {
                        showLevelText = false;
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
                EVENT_LEVEL_CROSS_THE_ROAD
            ]);
        }
    };
};
