# MusicManager 使用說明

`MusicManager` 是一個簡單的 JavaScript 類別，旨在幫助開發者管理和控制遊戲中的音樂播放。

## 快速開始

1. 將 `musicManager.js` 包含在你的專案中。
2. 創建一個 `MusicManager` 的實例。

    ```javascript
    const manager = new MusicManager();
    ```

3. 使用 `addMusic` 方法添加音樂到播放清單。

    ```javascript
    manager.addMusic('path/to/music1.mp3');
    manager.addMusic('path/to/music2.mp3');
    ```

4. 播放音樂。

    ```javascript
    manager.play(0); // 播放播放清單中索引為 0 的音樂
    ```

5. 在需要的時候，可以控制播放下一首、上一首或停止。

    ```javascript
    manager.playNext(); // 播放下一首
    manager.playPrev(); // 播放上一首
    manager.stop();     // 停止播放
    ```

## 循環播放

預設情況下，`MusicManager` 不會循環播放音樂。如果需要啟用循環播放，可以使用 `setLooping` 方法。

```javascript
manager.setLooping(true); // 啟用循環播放
```

## 注意事項

- 請確保提供正確的音樂檔案路徑。
- 如果使用 `setLooping` 啟用循環播放，請注意可能會造成無限循環。

## 範例

以下是一個簡單的使用範例：

```javascript
// 範例
const manager = new MusicManager();
manager.addMusic('path/to/music1.mp3');
manager.addMusic('path/to/music2.mp3');
manager.addMusic('path/to/music3.mp3');
  
// 啟用循環播放
manager.setLooping(true);
  
// 指定播放第一首音樂
manager.play(0);
  
// 在需要的時候播放下一首
// manager.playNext();
```