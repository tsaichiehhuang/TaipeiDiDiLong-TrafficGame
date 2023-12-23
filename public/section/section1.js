// A demo of section
const Section1 = () => {

    let sectionVariable = 'This is a variable in Section1 scope';

    // Demo walker a in session
    let walker1 = new Walker(startPosY = 100);
    
    return {
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
                switch(status) {
                    case EventStatus.SUCCESS:
                        // Do something
                        break;
                    case EventStatus.FAIL:
                        // Do something
                        break;
                }
            });

            // Demo start and success event
            eventManager.startEvent(EVENT_REPORT_RED_LINE_PARKING); // start immediately
            eventManager.startEvent(EVENT_LEVEL_TRAFFIC_LIGHT, 1000); // start after 1 second
            eventManager.successEvent(EVENT_LEVEL_TRAFFIC_LIGHT, 6000); // success after 6 seconds
        },

        drawDuringSection: () => {
            const currentEvents = eventManager.getCurrentEvent();
            
            // Demo draw based on current event
            if (currentEvents.has(EVENT_LEVEL_TRAFFIC_LIGHT)) {
                // 畫紅綠燈的相關遊戲元素
                text("紅綠燈相關事件...即將加分", 60, 100);
            }

            if (currentEvents.has(EVENT_REPORT_RED_LINE_PARKING)) {
                // 檢舉事件相關的東西
            }
        },

        drawAlways: () => {
            walker1.update();
        },

        onSectionEnd: () => {
            console.log('Section 1 end');
            // 可能結束所有此 section 的事件
            // 或是 trigger 下一階段的事件
            eventManager.endEvent(EVENT_REPORT_RED_LINE_PARKING);

            // 清除之後不會再用到的事件 listener
            eventManager.clearListeners([EVENT_REPORT_RED_LINE_PARKING, EVENT_LEVEL_TRAFFIC_LIGHT, EVENT_QA_FLOWER_SELLER])
        }
    };
};
