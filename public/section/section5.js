
const Section5 = () => {
    // 在 Section 內部宣告的區域變數，只能在這個範圍內存取
    let sectionVariable = 'This is a variable in Section5 scope';

    // get car position y when EVENT_REPORT_RUNNING_RED_LIGHT start
    let startPosiY;

    // running red light violation success var
    let successVio_RunningRedLight = false;

    // report success var
    let showImgAndText;

    return {
        preload: () => {
            // Called in p5.js preload() function

            // load running red light violation img
            this._redLightVio = loadImage('../images/redLineParking.jpeg');
        },
        
        onSectionStart: () => {

            // Demo listening event
            // 檢舉：闖紅燈
            eventManager.listen(EVENT_REPORT_RUNNING_RED_LIGHT, (status) =>{
                console.log('Running Red Light Event : ' + status);
                switch(status) {
                    case EventStatus.START:
                        // get car y position when running red light status is start
                        startPosiY = playerController.getPlayer().position.y;
                        break;
                    case EventStatus.SUCCESS:
                        // Do something
                        console.log("Report Success!")
                        break;
                    case EventStatus.FAIL:
                        // Do something
                        console.log("Report Fail!")
                        break;
                    case EventStatus.END:
                        // Do something
                        console.log("Running red light Event End, Report Fail!");
                        break;
                }
            });

            // Demo start and success event
            eventManager.startEvent(EVENT_REPORT_RUNNING_RED_LIGHT, 4000); // start after 4 second(Running Red Light)
        },

        draw: () => {
            
            // --------  原本的 drawAlways() ----------------
            // 不管哪個 section，都會執行
            // 在這畫圖會畫在 player 底下！

            // trigger running red light img
            image(this._redLightVio, gameManager.getRoadXRange()[1] - this._redLightVio.width, startPosiY - 800);

            // --------  原本的 drawDuringSection() ----------------
            // 這裡的程式碼只會在第 5 段執行
            if(gameManager.getSection() == 5) {
                
                console.log('Section 5 draw');
                const currentEvents = eventManager.getCurrentEvent();

                // Report on time or not when running red light event start
                if (currentEvents.has(EVENT_REPORT_RUNNING_RED_LIGHT)) {
                    if (keyIsDown(32)) {
                        eventManager.successEvent(EVENT_REPORT_RUNNING_RED_LIGHT);
                        showImgAndText = true;
                        successVio_RunningRedLight = true;
                    }else if(
                        playerController.getPlayer().position.y - playerController.playerHeight <
                        startPosiY - 800) {
                        eventManager.endEvent(EVENT_REPORT_RUNNING_RED_LIGHT);
                    }
                }

                // 在這畫圖會畫在 player 底下！
                sparkController.drawExistingSparks();  // 畫碰撞的火花
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
            console.log('The game end');
            // 可能結束所有此 section 的事件
            // 或是 trigger 下一階段的事件
        }
    };
};
