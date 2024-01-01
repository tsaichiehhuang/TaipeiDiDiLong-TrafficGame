let showText = true;

class RunRedLightManager {
  draw = (status) => {
    // Break out the game when report success
    setTimeout(() => {
      showText = false;
    }, 2000);

    if (showText) {
      let xCurrPosi =
        (gameManager.getRoadXRange()[0] + gameManager.getRoadXRange()[1]) / 2;
      let yCurrPosi =
        (gameManager.getVisibleYRange()[0] +
          gameManager.getVisibleYRange()[1]) /
        2;

      // 在畫面中間顯示文字，並且不要讓user可以繼續操作
      rectMode(CENTER);
      fill(255, 255, 255);
      textSize(30);

      // 判斷有沒有違規
      if (status === "stopped") {
        text(
          "好棒！你有遵守紅綠燈，加1分！",
          xCurrPosi - 200,
          yCurrPosi - 100,
          500,
          100
        );
      } else {
        text(
          "你沒有遵守紅綠燈，扣1分！",
          xCurrPosi - 200,
          yCurrPosi - 100,
          500,
          100
        );
        text(
          "機車闖紅燈會罰款1,800元~2,700元哦！",
          xCurrPosi - 200,
          yCurrPosi - 50,
          500,
          100
        );
      }
    }
  };
}
