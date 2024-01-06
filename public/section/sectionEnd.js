/**
 * 遊戲結束畫面
 */
const SectionEnd = () => {

    const END_SECTION_NUM = 6;
    const fadeOutTime = 3000;

    let isShowingEndingUI = false;
    let blackScreenAlpha = 0;

    return {
        preload: () => {
            // Called in p5.js preload() function
            endUIController.preload();
        },

        onSectionStart: () => {
            endUIController.setup(score = playerData.getScore(), tickets = playerData.getTrafficTickets());

            // 鍵盤不能控制
            keyPressedManager.setKeyPressedStop(true);
            player.vel.x = 0;
            player.vel.y = -playerController.playerSpeed;

            // 讓玩家看起來騎車到螢幕外
            gameManager.setCameraFollowPlayer(false);

            // 三秒後螢幕變黑
            setTimeout(() => {
                isShowingEndingUI = true;
            }, fadeOutTime);

        },

        draw: () => {
            if (gameManager.getSection() == END_SECTION_NUM) {
                // 結束畫面
                if (isShowingEndingUI) {
                    camera.off();
                    endUIController.show();
                } else { // 最終遊戲的畫面：玩家脫離螢幕
                    playerController.draw();
                    camera.off();

                    mainUIController.setIsShowing(false);

                    // Black screen fading
                    fill(0, 0, 0, blackScreenAlpha);
                    rect(0, 0, width, height);
                    blackScreenAlpha += 255 / fadeOutTime * (1000 / frameRate());
                }
            }
        },

        onSectionEnd: () => {
            // 可能結束所有此 section 的事件
            // 或是 trigger 下一階段的事件
        }
    };
};
