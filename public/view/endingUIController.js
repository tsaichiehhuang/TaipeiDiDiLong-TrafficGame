class EndingUIController {
	constructor() {
		this.score == null;
		this.tickets == null;
	}

	preload = () => {
	}

	setup = () => {
		this.button = createButton('再玩一次');
		this.button.position(width/2, height - 100);	  
		this.button.mousePressed(() => {
			window.location.href = "index.html" ; // index or game?
		  });
	}

	show = (score, tickets) => {
		push();
		// 底色
		noStroke();
		rectMode(CENTER);
		fill(246, 247, 251);
		let radius = 40; // 圓角
		rect(width/2, height/2, width * 0.7, height * 0.7, radius, radius, radius, radius);
		// 字色
		fill(60);
		this._showTexts([`分數: ${score}`, this._generateTextByScore(score), this._genereateTicketText(tickets)]);
		pop();
	}

	_showTexts = (texts, yOffset = 200) => {
		texts.forEach((t, index) => {
			text(t, width/2 - 200, yOffset + index * 50);
		});
	}

	_genereateTicketText = (tickets) => {
		let text = '';
		let sum = 0;
		tickets.forEach((t) => {
			text += `${t.title} ${t.amount} 元\n`;
			sum += t.amount;
		});
		text += `罰單總計 ${sum} 元`;
		return text;
	}

    /**
     * 根據分數，顯示不同的文字評語
     */
    _generateTextByScore =  (score) => {

        if(score <= 4) {
            return `你很有三寶潛力，還是不要上路比較好^_^`;
        }
        if(score <= 9) {
            return `再多注意一些細節，才能快樂出門、平安回家喔！`;
        }
        return `你是遵守交通規則的超讚安全駕駛！`;
    }
}
