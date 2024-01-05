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
const EVENT_REPORT_DOUBLE_PARKING = "event_report_double_parking";
const EVENT_LEVEL_BUY_DRINK = "event_level_buy_drink";

// Section3
const EVENT_LEVEL_CROSS_THE_ROAD = "event level cross the road";
const EVENT_QA_PASSERBY = "event_id_passerby";

// Section4
const EVENT_REPORT_CROSS_HATCH_PARKING = "event_report_crpss_hatch_parking";
const EVENT_LEVEL_BUY_DINNER = "event_level_buy_dinner";

// Section5
const EVENT_REPORT_RUNNING_RED_LIGHT = "event_id_report_running_red_light";

const _eventsMap = {
    [EVENT_LEVEL_TRAFFIC_LIGHT]: {
        EventName: "關卡_等紅燈", // Human readable name
        EventType: EventType.LEVEL,
        SuccessScore: 10,
        FailScore: -10,
    },
    [EVENT_REPORT_RED_LINE_PARKING]: {
        EventName: "檢舉_紅線停車",
        EventType: EventType.REPORT,
        SuccessScore: 10,
        FailScore: -5,
    },
    [EVENT_QA_FLOWER_SELLER]: {
        EventName: "情境_玉蘭花",
        EventType: EventType.QA,
        SuccessScore: 10,
        FailScore: 0, // 情境題答錯不扣分
    },
    [EVENT_REPORT_DOUBLE_PARKING]: {
        EventName: "檢舉_並排停車",
        EventType: EventType.REPORT,
        SuccessScore: 10,
        FailScore: -5,
    },
    [EVENT_LEVEL_BUY_DRINK]: {
        EventName: "關卡_買飲料",
        EventType: EventType.LEVEL,
        SuccessScore: 50,
        FailScore: 0,
    },
    [EVENT_LEVEL_CROSS_THE_ROAD]: {
        EventName: "關卡_行走斑馬線過馬路",
        EventType: EventType.LEVEL,
        SuccessScore: 10,
        FailScore: -10,
    },
    [EVENT_QA_PASSERBY]: {
        EventName: "情境_路人",
        EventType: EventType.QA,
        SuccessScore: 10,
        FailScore: 0,
    },
    [EVENT_REPORT_CROSS_HATCH_PARKING]: {
        EventName: "檢舉_網狀線停車",
        EventType: EventType.REPORT,
        SuccessScore: 10,
        FailScore: -5,
    },
    [EVENT_LEVEL_BUY_DINNER]: {
        EventName: "關卡_買晚餐",
        EventType: EventType.LEVEL,
        SuccessScore: 50,
        FailScore: 0,
    },
    [EVENT_REPORT_RUNNING_RED_LIGHT]: {
        EventName: "檢舉_闖紅燈",
        EventType: EventType.REPORT,
        SuccessScore: 10,
        FailScore: -5,
    },
};
