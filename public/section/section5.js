const Section5 = () => {
    // 在 Section 內部宣告的區域變數，只能在這個範圍內存取
    let sectionVariable = 'This is a variable in Section1 scope';

    return {
        preload: () => {
            // Called in p5.js preload() function
        },
        
        onSectionStart: () => {

        },

        draw: () => {
            
            // 不管哪個 section，都會執行
            // 原本的 drawAlways()
            // 在這畫圖會畫在 player 底下！

            if(gameManager.getSection() == 5) {
                // 原本的 drawDuringSection()
                // 這裡的程式碼只會在第 5 段執行
                console.log('Section 5 draw');

                // 在這畫圖會畫在 player 底下！
                
                playerController.draw(); // 畫玩家
                
                // 在這畫圖會蓋在 player 上面！
            }

            // 不管哪個 section，都會執行
            // 在這畫圖會蓋在 player 上面！
        },

        onSectionEnd: () => {
            // 可能結束所有此 section 的事件
            // 或是 trigger 下一階段的事件
        }
    };
};
