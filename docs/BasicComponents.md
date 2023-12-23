# 遊戲基本元件

目前頁面：
1. `index.html` :封面
2. `game.html` (`game.js`) :遊戲本體


## 基本元件

### `GameManager`
管理背景、道路圖片、畫布、目前段落（1~5）

Functions:
- `getRoadXRange()`: 取得道路的邊界，回傳左界 x 座標和右界的 x 座標
- `getVisibleYRange()`: 取得目前畫面上下邊界，回傳上界 y 座標和下屆 y 座標
- `getSection()`: 取得目前的段落編號（1 ~ 5）
- `setSection(newSection)`: 設定段落
- `cameraFollow(followPoint)` : 設定相機的跟隨位置

### `SectionManager`
管理 Section 的切換

#### `section/section1~5.js`
每個段落的邏輯，在某個段落發生的事情可以寫在對應的段落裡面

Functions:
- `preload`: 在 p5.js 的 preload 執行一次
- `onSectionStart`: Section 開始時觸發一次
- `drawDuringSection`: 在該 Section 進行時重複執行
- `drawAlways`: 不論 Section 為何，都會一直執行（相當於寫在 p5.js draw 裡面）
    - 例如前面留下的車禍現場或是停車格等等不應該因 section 結束就消失的東西
- `onSectionEnd`: Section 結束時觸發一次

### `MainUIContrller`
- 管理常駐的 UI
- 目前包含分數、任務、警告

### `EventManager`
- 管理事件（有獨立的文件）
- 事件資訊存放在 `data/eventData.js`

### `PlayerData`
- 管理玩家的分數、玩家的罰單

Functions:
- `addScore(changedScore)`: 加分
- `getScore()`
- `addTrafficTicket(title, amount)`: 加罰單
- `onScoreChange(callback)`: 註冊一個分數更新時的 callback

### `PlayerController`
負責控制 player 以及 player 的 sprite

Functions:
- `getPlayer()`: 拿到 player 的 sprite，可以做碰撞偵測或是取得位置速度資訊等等
    - `play.js` 有 `let player = playerController.getPlayer()` 可以使用


## 遊戲移動邏輯
- `PlayerController` 控制玩家的移動，遊戲中使用 p5play 的 camera 跟隨玩家
    -  p5play camera: https://p5play.org/learn/camera.html
- 背景的道路是由可無縫接軌的道路圖片組成

---
## Demo 用物件

使用上述的 functions 的一些 demo 用物件

### `Walker`
- 用來 demo 行人
- 使用 gameManager 的道路邊界

### `Car`
- 用來 demo 對向的車子
- 使用 `playerData.addScore(-1)` 讓撞到時扣分

