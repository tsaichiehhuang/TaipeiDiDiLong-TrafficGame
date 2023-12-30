class QuestionManager {
  constructor() {
    this.questions = [
      {
        question: "在雙向 2 車道上「欲」超越前行車，發現對向有來車，你應該？",
        options: [
          "(1) 立即減速放棄超車",
          "(2) 馬上加速搶先超越",
          "(3) 按鳴喇叭，促來車減速或避讓",
        ],
        answer: 0,
      },
      {
        question: "行人穿越馬路時，未禮讓行人通過最高可罰？",
        options: ["(1) 1,200 元", "(2) 3,600 元", "(3) 6,000 元罰鍰"],
        answer: 3,
      },
      {
        question:
          "機車駕駛人行駛於道路時，以手持方式使用行動電話、電腦或其他相類功能裝置進行撥接、通話、數據通訊或其他有礙駕駛安全之行為者，處新臺幣？",
        options: ["(1) 1,000 元", "(2) 1,500 元", "(3) 2,000 元罰鍰"],
        answer: 1,
      },
      {
        question: "機車在未劃分快慢車道之單行道行駛，應在？",
        options: [
          "(1) 最左、右車道行駛",
          "(2) 只能在最右車道行駛",
          "(3) 任何車道均可行駛。",
        ],
        answer: 1,
      },
      {
        question: "機車在同一車道行駛時，與前車之間應保持？",
        options: [
          "(1) 隨時可以煞停之距離",
          "(2) 5 公尺距離",
          "(3) 10 公尺距離。",
        ],
        answer: 1,
      },
      {
        question: "在紅燈亮時，行人穿越道上無人穿越，且交叉路口車輛不擁擠時：",
        options: ["(1) 可以向前行駛", "(2) 可以右轉行駛", "(3) 禁止行駛。"],
        answer: 3,
      },
      {
        question: "駕駛機車有闖紅燈行為之處罰是？",
        options: [
          "(1) 罰鍰新臺幣 1,200 元至 3,600 元",
          "(2) 吊扣駕駛執照 1 個月",
          "(3) 罰鍰新臺幣 1,800 元至 5,400 元並記違規點數 3 點。",
        ],
        answer: 3,
      },
      {
        question: "機車照後鏡之使用，何者不適當？",
        options: [
          "(1) 行進中與前車距離很近時，需觀看照後鏡以利超車",
          "(2) 行駛前應將照後鏡調整至容易觀察後方車輛或道路狀況之角度與位置",
          "(3) 可利用等待紅燈時間調整照後鏡。",
        ],
        answer: 1,
      },
      {
        question: "騎乘機車至商店購物時應？",
        options: [
          "(1) 先將機車在指定停放位置停妥後再進入店中購物",
          "(2) 停在路邊大聲呼叫店員將物品送來",
          "(3) 任意停在商店門口櫃檯前或行人道中。",
        ],
        answer: 1,
      },
      {
        question:
          "駕駛人駕車行駛人行道，或經行人穿越道不依規定讓行人優先通行，因而致人受傷或死亡，依法應負刑事責任者加重其刑至？",
        options: ["(1) 一倍", "(2) 二倍", "(3) 二分之一。"],
        answer: 3,
      },
      {
        question: "行近行人穿越道時，應？",
        options: [
          "(1) 減速慢行，遇有行人穿越，應暫停讓行人先行",
          "(2) 鳴喇叭穿越通過",
          "(3) 加速通過。",
        ],
        answer: 1,
      },
    ];

    this.currentQuestion = null;
  }

  setup = () => {
    // TODO: setup question or images
  };

  getRadomQuestion = () => {
    const randomIndex = Math.floor(Math.random() * this.questions.length);
    this.currentQuestion = this.questions[randomIndex];
    return this.currentQuestion;
  };

  getCorrectAnswer = () => {
    if (this.currentQuestion) {
      return this.currentQuestion.answer;
    }
    return null;
  };

  draw = (text) => {
    // 在畫面中間顯示情境題框框，要包含依據不同觸發情境的傳進來的招呼語（text）、題目以及選項按鈕

    // 情境題框框
    fill(255, 255, 255, 200);
    rect(width / 2 - 300, height / 2 - 200, 600, 400);

    // 招呼語
    textSize(30);
    fill(0);
    text(text, width / 2 - 260, height / 2 - 150, 500, 100);

    // 題目
    textSize(20);
    fill(0);
    text(
      this.currentQuestion.question,
      width / 2 - 260,
      height / 2 - 100,
      500,
      100
    );

    // 選項按鈕，要有 hover 效果，按下去要有反應
    textSize(20);
    fill(0);
    text(
      this.currentQuestion.options[0],
      width / 2 - 260,
      height / 2 - 50,
      500,
      100
    );
    text(
      this.currentQuestion.options[1],
      width / 2 - 260,
      height / 2,
      500,
      100
    );
    text(
      this.currentQuestion.options[2],
      width / 2 - 260,
      height / 2 + 50,
      500,
      100
    );
  };
}
