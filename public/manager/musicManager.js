class MusicManager {
	constructor() {
	  this.audio = new Audio();
	  this.playlist = [];
	  this.currentIndex = 0;
	  this.isLooping = false;
  
	  // 監聽音樂結束事件，以便自動播放下一首或循環播放
	  this.audio.addEventListener('ended', () => {
		if (this.isLooping) {
		  this.play(this.currentIndex); // 循環播放
		} else {
		  this.playNext(); // 播放下一首
		}
	  });
	}
  
	// 添加音樂到播放清單
	addMusic(musicUrl) {
	  this.playlist.push(musicUrl);
	}
  
	// 播放指定索引的音樂
	play(index) {
	  if (index >= 0 && index < this.playlist.length) {
		this.currentIndex = index;
		this.audio.src = this.playlist[index];
		this.audio.play();
	  } else {
		console.error('Invalid index');
	  }
	}
  
	// 播放下一首音樂
	playNext() {
	  this.currentIndex = (this.currentIndex + 1) % this.playlist.length;
	  this.play(this.currentIndex);
	}
  
	// 播放上一首音樂
	playPrev() {
	  this.currentIndex = (this.currentIndex - 1 + this.playlist.length) % this.playlist.length;
	  this.play(this.currentIndex);
	}
  
	// 停止播放音樂
	stop() {
	  this.audio.pause();
	  this.audio.currentTime = 0;
	}
  
	// 啟用或禁用循環播放
	setLooping(loop) {
	  this.isLooping = loop;
	}
}