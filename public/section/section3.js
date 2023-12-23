const Section3 = () => {
    // 在 Section 內部宣告的區域變數，只能在這個範圍內存取
    let sectionVariable = 'This is a variable in Section1 scope';

    return {
        onSectionStart: () => {

        },

        drawDuringSection: () => {
            // 只會在此 section 一直執行的事件
        },

        drawAlways: () => {
            // 不論是否在此 section，都會執行
        },

        onSectionEnd: () => {
            // 可能結束所有此 section 的事件
            // 或是 trigger 下一階段的事件
        }
    };
};
