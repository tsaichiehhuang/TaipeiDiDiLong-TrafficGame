const Section2 = () => {
    // 在 Section 內部宣告的區域變數，只能在這個範圍內存取
    let sectionVariable = 'This is a variable in Section2 scope';

    

    return {
        preload: () => {
            // Called in p5.js preload() function
            console.log("Section 2 preload");
        },
        
        onSectionStart: () => {

        },

        draw: () => {
            // 不管哪個 section，都會執行
            // 原本的 drawAlways()
            // 在這畫圖會畫在 player 底下！

            if(gameManager.getSection() ==2) {
                // 原本的 drawDuringSection()
                // 這裡的程式碼只有在第二段時執行
                console.log('Section 2 draw');

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
