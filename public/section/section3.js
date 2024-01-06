const Section3 = () => {
    // 在 Section 內部宣告的區域變數，只能在這個範圍內存取
    let sectionVariable = "This is a variable in Section3 scope";

    let startPosiY_crossTheRoad;
    let showLevelText = false;
    let isStoppedInLevel;

    let showQaQuestion = false;
    let qaResult = null;

    let walker = new Walker(0, 0);
    let crosswalkPosY;
    // 玩家靠多近行人在開始走，從馬路最上端開始
    let crosswalkDetectDistance = 500;

    return {
        preload: () => {
            // Called in p5.js preload() function
            console.log("Section 3 preload");

            // load event image
            this._crossTheRoad = loadImage("../images/section3/Road_3.png");

            this._walkerImg = loadImage("../images/section3/walker_temp.png");
        },

        onSectionStart: () => {
            eventManager.startEvent(EVENT_LEVEL_CROSS_THE_ROAD, 1500);

            // 關卡：行人過馬路
            eventManager.listen(EVENT_LEVEL_CROSS_THE_ROAD, (status) => {
                console.log("Cross the roas event : " + status);
                switch (status) {
                    case EventStatus.START:
                        startPosiY_crossTheRoad =
                            playerController.getPlayer().position.y;

                        crosswalkPosY = player.position.y - 1000;

                        let [endX, startX] = gameManager.getRoadXRange();
                        // 放個行人在斑馬線位置
                        walker.setup(
                            startX + 100,
                            crosswalkPosY + 200,
                            endX - 80,
                            (img = this._walkerImg)
                        );

                        // 設定撞到行人就失敗
                        walker.setCollidePlayerCallback(() => {
                            if (
                                !eventManager
                                    .getCurrentEvent()
                                    .has(EVENT_LEVEL_CROSS_THE_ROAD)
                            )
                                return;
                            eventManager.failEvent(
                                EVENT_LEVEL_CROSS_THE_ROAD,
                                1000
                            );
                        });
                        break;
                    case EventStatus.SUCCESS:
                        isStoppedInLevel = true;
                        setTimeout(() => {
                            showLevelText = true;
                        }, 1000);
                        console.log("Cross the road success");
                        eventManager.startEvent(EVENT_QA_PASSERBY, 500);
                        break;
                    case EventStatus.FAIL:
                        isStoppedInLevel = false;
                        showLevelText = true;
                        console.log("Cross the road fail");
                        gameManager.nextSectionAfterScreenHeight();
                        playerData.addTrafficTicket("未禮讓行人", 6000);
                        break;
                }
            });

            // 路人情境事件
            eventManager.listen(EVENT_QA_PASSERBY, (status) => {
                console.log("Passerby event : " + status);
                switch (status) {
                    case EventStatus.START:
                        keyPressedManager.setKeyPressedStop(true);
                        questionManager.setup();
                        setTimeout(() => {
                            questionManager.getRandomQuestion(
                                EVENT_QA_PASSERBY
                            );
                            showQaQuestion = true;
                        }, 3500);
                        break;
                    case EventStatus.SUCCESS:
                        showQaQuestion = false;
                        qaResult = true;
                        setTimeout(() => {
                            qaResult = null;
                            walker.setIsMoving(true);
                            keyPressedManager.setKeyPressedStop(false);
                        }, 3000);
                        console.log("Passerby success");
                        gameManager.nextSectionAfterScreenHeight();
                        break;
                    case EventStatus.FAIL:
                        showQaQuestion = false;
                        qaResult = false;
                        setTimeout(() => {
                            qaResult = null;
                            walker.setIsMoving(true);
                            keyPressedManager.setKeyPressedStop(false);
                        }, 3500);
                        console.log("Passerby fail");
                        gameManager.nextSectionAfterScreenHeight();
                        break;
                }
            });
        },

        draw: () => {
            // 不管哪個 section，都會執行
            // 原本的 drawAlways()
            // 在這畫圖會畫在 player 底下！

            image(
                this._crossTheRoad,
                gameManager.getRoadXRange()[0] + 7,
                crosswalkPosY
            );

            if (gameManager.getSection() == 3) {
                // 原本的 drawDuringSection()
                // 這裡的程式碼只會在第 3 段執行
                console.log("Section 3 draw");
                const currentEvents = eventManager.getCurrentEvent();

                if (currentEvents.has(EVENT_LEVEL_CROSS_THE_ROAD)) {
                    // Only detect player is stopped when player close to crosswalk
                    if (
                        player.position.y <
                        crosswalkPosY + crosswalkDetectDistance
                    ) {
                        // 當玩家夠靠近時，行人才會走😈
                        if (!walker.isMoving) {
                            walker.setIsMoving(true);
                        }

                        // 如果玩家已經超過了行人，觸發沒有禮讓
                        if (player.position.y < walker.sprite.position.y) {
                            eventManager.failEvent(EVENT_LEVEL_CROSS_THE_ROAD);
                        }

                        // 如果路人走到超過斑馬線中間的時候
                        if (walker.sprite.position.x < width / 2) {
                            if (walker.isMoving) {
                                // 行人先停下來 然後顯示感謝禮讓的那段字後 接著情境題
                                walker.setIsMoving(false);
                                // walker.say("感謝禮讓！");
                                eventManager.successEvent(
                                    EVENT_LEVEL_CROSS_THE_ROAD
                                );
                                keyPressedManager.setKeyPressedStop(true);
                            }
                        }
                    }
                }

                // 在這畫圖會畫在 player 底下！
                sparkController.drawExistingSparks(); // 畫碰撞的火花

                playerController.draw(); // 畫玩家

                walker.draw();

                // 在這畫圖會蓋在 player 上面！
                if (showLevelText) {
                    crossTheRoadManager.draw(
                        isStoppedInLevel ? "stopped" : "notStopped"
                    );
                    setTimeout(() => {
                        showLevelText = false;
                    }, 2000);
                }

                if (showQaQuestion) {
                    questionManager.showQuestion({
                        greeting:
                            "嗨咿！我們有緣在路上相遇，你能幫我回答一個問題嗎？",
                    });
                }

                if (qaResult !== null) {
                    questionManager.showResult(qaResult);
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
                EVENT_QA_PASSERBY,
            ]);
        },
    };
};
