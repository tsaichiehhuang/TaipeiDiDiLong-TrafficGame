# EventManager
EventManager 負責管理事件（關卡，檢舉，情境題，或其他短期發生的事件）

## Event
> 依照遊戲情境的 google 文件，每個 event（關卡，檢舉，情境題） 都有成功與失敗判定、成功與失敗的分數、以及觸發的機制。

因此每個 Event 可以定義成
- EventId (unique)
- EventName（方便辨識的名字）
- EventType (關卡，檢舉，情景，或其他)
- SuccessScore（事件成功時要加的分數）
- FailScore（事件失敗時要加的分數）

## How to use

### 1. 在 `eventData.js` 定義一個 event

1. 幫 Event 取一個 EventID（type : string），放在 `eventData.js` 中

例如這是一個檢舉紅線停車的 event：
```js
const EVENT_REPORT_RED_LINE_PARKING = 'event_id_report_red_line_parking';
```

2. 在 `eventMap` 中，以 EventID 為 key，建立一個 entry

每個事件的資訊包含：
- EventName：方便辨識的名字
- EventType：事件的種類
    - `EventType.LEVEL`（關卡）
    - `EvenetType.REPORT`（檢舉）
    - `EventType.QA`（情境）
    - `EventType.OTHER` 其他
- SuccessScore：事件成功時會加的分數
- FailScore：事件失敗時會加的分數（寫負數）

例子：
```js
const _eventsMap = {
  //... 
  // 加入一個事件：檢舉紅線停車
  [EVENT_REPORT_RED_LINE_PARKING]: {
    "EventName": "檢舉_紅線停車", // 方便辨識的名字
    "EventType": EventType.REPORT, // 檢舉
    "SuccessScore": 50, // 成功時加分
    "FailScore": 0.5 // 失敗時扣分
  },
};
```

### 2. 觸發 event
> 注意：已經在進行的 event 不能被再次觸發

在事件觸發點使用 `eventManger.startEvent(eventId, delay)`
- `eventID` 使用第一步驟的創建的 ID 變數
- `delay` （optional）如果要延遲觸發，可設定延遲豪秒數。預設為 0 ms，立刻觸發


### 3. 監聽 event 狀態的改變，或取得目前發生的 event

觸發 event 後，若要依據 event 做一些變化，可以透過兩種方式：
1. 監聽（訂閱）event 狀態的更新
2. 直接取得正在發生的 event


#### 3-1. 監聽（訂閱）event 狀態的更新

使用 `eventManger.listen(eventId, callback(status))` 可以監聽特定事件的狀態改變


##### Event Status 事件狀態
```js
const EventStatus = {
    START: 'start',
    END: 'end',
    SUCCESS: 'success',
    FAIL: 'fail',
  };
```

例子：
```js
// 監聽 EVENT_LEVEL_TRAFFIC_LIGHT 事件
eventManager.listen(EVENT_LEVEL_TRAFFIC_LIGHT, (status) => {
    // 當EVENT_LEVEL_TRAFFIC_LIGHT 事件的狀態發生改變時...
    if (status === EventStatus.SUCCESS) {
        // do something here for handling success
    }
})
```

#### 3-2. 直接取得正在發生的 event

使用 `eventManger.getCurrentEvent()` ，可以得到目前正在發生（已開始）的 eventID set

例子：
```js
// 取得目前正在發生的 event
const currentEvents = eventManager.getCurrentEvent();

// Demo draw based on current event
if (currentEvents.has(EVENT_LEVEL_TRAFFIC_LIGHT)) {
    // 畫紅綠燈之類的
    text("紅綠燈相關事件", 60, 100);
}
```

### 4. 依據需求結束 event
> 注意：沒有正在發生 event 不能被結束

三種完成事件的方式：
1. 成功（加分）
2. 失敗（扣分）
3. 結束（不改變分數）


#### 4-1. 成功完成（會加分）

- 結束 event 並**加分**
- 依照 eventData.js 定義的 `SuccessScore` 加分

使用：
```js
// eventID: 定義在 eventData.js 的 EventID
// delay: 延遲幾毫秒再完成，預設為 0，立刻完成
// deleteEvent: 是否從 currentEvents 中刪除，預設為 true
eventManager.successEvent(eventId, delay = 0, deleteEvent = true)
```

#### 4-2. 失敗完成（會扣分）

- 結束 event 並**扣分**
- 依照 eventData.js 定義的 `FailScore` 扣分

使用：
```js
// eventID: 定義在 eventData.js 的 EventID
// delay: 延遲幾毫秒再完成，預設為 0，立刻完成
// deleteEvent: 是否從 currentEvents 中刪除，預設為 true
eventManager.failEvent(eventId, delay = 0, deleteEvent = true)
```


#### 4-3. 結束（不改變分數）
- 結束 event

使用：
```js
// eventID: 定義在 eventData.js 的 EventID
// delay: 延遲幾毫秒再完成，預設為 0，立刻完成
// deleteEvent: 是否從 currentEvents 中刪除，預設為 true
eventManager.endEvent(eventId, delay = 0, deleteEvent = true)
```
