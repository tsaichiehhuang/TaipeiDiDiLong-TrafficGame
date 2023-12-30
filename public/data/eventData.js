const EventType = {
  LEVEL: "level", // 關卡
  REPORT: "report", // 檢舉
  QA: "qa", // 情境題
  OTHER: "other", // 其他
};

// [EventIDs]

// Section 1
const EVENT_REPORT_RED_LINE_PARKING = "event_id_report_red_line_parking";
const EVENT_LEVEL_TRAFFIC_LIGHT = "event_id_level_traffic_light";
const EVENT_QA_FLOWER_SELLER = "event_id_flower_seller";

// Section2
// etc...

const _eventsMap = {
  [EVENT_LEVEL_TRAFFIC_LIGHT]: {
    EventName: "關卡_等紅燈", // Human readable name
    EventType: EventType.LEVEL,
    SuccessScore: 1,
    FailScore: -1,
  },
  [EVENT_REPORT_RED_LINE_PARKING]: {
    EventName: "檢舉_紅線停車",
    EventType: EventType.REPORT,
    SuccessScore: 1,
    FailScore: -0.5,
  },
  [EVENT_QA_FLOWER_SELLER]: {
    EventName: "情境_玉蘭花",
    EventType: EventType.QA,
    SuccessScore: 1,
    FailScore: 0, // 情境題答錯不扣分
  },
};
