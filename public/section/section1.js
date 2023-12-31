// A demo of section
const Section1 = () => {

    let sectionVariable = 'This is a variable in Section1 scope';

    // Demo walker a in section
    let walker1 = new Walker(startPosY = 100, "第一個行人");

    // get car position y when EVENT_REPORT_RED_LINE_PARKING start
    let RedLineParkingStart_PosiY;

    // red line violation success var
    let successVio_RedLineParking = false;

    // report success var
    let showImgAndText;
    
    return {
        preload: () => {
            // Called in p5.js preload() function
            console.log('Section 1 preload');

            // load red line parking violation img
            this._redLineVio = loadImage('../images/redLineParking.jpeg');
        },

        onSectionStart: () => {

            walker1.setup(gameManager.getRoadXRange());

            // Demo listening event
            // 關卡：紅綠燈
            eventManager.listen(EVENT_LEVEL_TRAFFIC_LIGHT, (status) => {
                console.log('Traffic light event : ' + status);
                switch(status) {
                    case EventStatus.SUCCESS:
                        // 觸發玉蘭花情境題
                        eventManager.startEvent(EVENT_QA_FLOWER_SELLER, 500);
                        break;
                    case EventStatus.FAIL:
                        // Do something
                        break;
                }
            })

            // 檢舉：紅線停車
            eventManager.listen(EVENT_REPORT_RED_LINE_PARKING, (status) => { 
                console.log('Red line event : ' + status);
                switch(status) {
                    case EventStatus.START:
                        // get car y position when red line parking status is start
                        RedLineParkingStart_PosiY = playerController.getPlayer().position.y;
                        break;
                    case EventStatus.SUCCESS:
                        // Do something
                        console.log("Report Success!");
                        break;
                    case EventStatus.FAIL:
                        // Do something
                        console.log("Report Fail!")
                        break;
                }
            });

            // Demo start and success event
            eventManager.startEvent(EVENT_REPORT_RED_LINE_PARKING, 3000); // start after 4 second(Red Light Parking)
            eventManager.startEvent(EVENT_LEVEL_TRAFFIC_LIGHT, 6000); // start after 6 second(Traffic Light)
            eventManager.successEvent(EVENT_LEVEL_TRAFFIC_LIGHT, 7000); // success after 7 seconds(Success Traffic Light)
        },

        draw: () => {
            
            // --------  原本的 drawAlways() ----------------
            // 不管哪個 section，都會執行
            // 在這畫圖會畫在 player 底下！

            walker1.update();

            // trigger red line parking img
            image(this._redLineVio, gameManager.getRoadXRange()[1] - this._redLineVio.width, RedLineParkingStart_PosiY - 750);

            // --------  原本的 drawDuringSection() ----------------
            // 這裡的程式碼只會在第 1 段執行
            if(gameManager.getSection() == 1) {
                
                console.log('Section 1 draw');
                const currentEvents = eventManager.getCurrentEvent();
                
                // Demo draw based on current event
                if (currentEvents.has(EVENT_LEVEL_TRAFFIC_LIGHT)) {
                    // 畫紅綠燈的相關遊戲元素
                    text("紅綠燈相關事件...即將加分", 60, 100);
                }

                // Report on time or not when red line parking event start
                if (currentEvents.has(EVENT_REPORT_RED_LINE_PARKING)) {
                    if (keyIsDown(32)) {
                        eventManager.successEvent(EVENT_REPORT_RED_LINE_PARKING);
                        showImgAndText = true;
                        successVio_RedLineParking = true;
                    }else if (playerController.getPlayer().position.y + 50 < RedLineParkingStart_PosiY - 750) {
                        eventManager.endEvent(EVENT_REPORT_RED_LINE_PARKING);
                    }
                }
                
                playerController.draw(); // 畫玩家

                // 在這畫圖會蓋在 player 上面！

                // Break out the game when report success
                if(successVio_RedLineParking) {
                    violationManager.draw("redLineParking", showImgAndText);
                    setTimeout(() => {
                        successVio_RedLineParking = false;
                    }, 2000);
                }
            }
            // ------------------------------------------- 
            // 不管哪個 section，都會執行
            // 在這畫圖會蓋在 player 上面！
        },

        onSectionEnd: () => {
            console.log('Section 1 end');
            // 可能結束所有此 section 的事件
            // 或是 trigger 下一階段的事件

            // 清除之後不會再用到的事件 listener
            eventManager.clearListeners([EVENT_REPORT_RED_LINE_PARKING, EVENT_LEVEL_TRAFFIC_LIGHT, EVENT_QA_FLOWER_SELLER])
        }
    };
};
