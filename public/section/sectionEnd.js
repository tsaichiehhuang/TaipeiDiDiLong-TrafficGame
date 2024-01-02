/**
 * 遊戲結束畫面
 */
const SectionEnd = () => {
    let endUIController = new EndingUIController();
    const END_SECTION_NUM = 6;
    return {
        preload: () => {
            // Called in p5.js preload() function
            endUIController.preload();
        },
        
        onSectionStart: () => {
            endUIController.setup();

            // 停止玩家移動
            player.vel.x = 0;
            player.vel.y = 0;
        },

        draw: () => {
            if(gameManager.getSection() == END_SECTION_NUM) {
                camera.off();
                endUIController.show(score = playerData.getScore(), tickets = playerData.getTrafficTickets());
            }
        },

        onSectionEnd: () => {
            // 可能結束所有此 section 的事件
            // 或是 trigger 下一階段的事件
        }
    };
};
