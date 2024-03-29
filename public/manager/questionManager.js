class QuestionManager {
    constructor() {
        this.questions = [
            {
                question: '在雙向兩車道上「欲」超越前行車，發現對向有來車，你應該？',
                options: ['1. 立即減速放棄超車', '2. 馬上加速搶先超越', '3. 按鳴喇叭，促來車減速或避讓'],
                answer: 1,
            },
            {
                question: '行人穿越馬路時，未禮讓行人通過最高可罰？',
                options: ['1. 1,200 元', '2. 3,600 元', '3. 6,000 元罰鍰'],
                answer: 3,
            },
            {
                question:
                    '機車駕駛人行駛於道路時，以手持方式使用行動電話、電腦或其他相類功能\n裝置進行撥接、通話、數據通訊或其他有礙駕駛安全之行為者，處新臺幣？',
                options: ['1. 1,000 元', '2. 1,500 元', '3. 2,000 元罰鍰'],
                answer: 1,
            },
            {
                question: '機車在未劃分快慢車道之單行道行駛，應在？',
                options: ['1. 最左、右車道行駛', '2. 只能在最右車道行駛', '3. 任何車道均可行駛。'],
                answer: 1,
            },
            {
                question: '機車在同一車道行駛時，與前車之間應保持？',
                options: ['1. 隨時可以煞停之距離', '2. 5 公尺距離', '3. 10 公尺距離。'],
                answer: 1,
            },
            {
                question: '在紅燈亮時，行人穿越道上無人穿越，且交叉路口車輛不擁擠時：',
                options: ['1. 可以向前行駛', '2. 可以右轉行駛', '3. 禁止行駛。'],
                answer: 3,
            },
            // {
            //     question: "駕駛機車有闖紅燈行為之處罰是？",
            //     options: [
            //         "1. 罰鍰新臺幣 1,200 元至 3,600 元",
            //         "2. 吊扣駕駛執照 1 個月",
            //         "3. 罰鍰新臺幣 1,800 元至 5,400 元並記違規點數 3 點。",
            //     ],
            //     answer: 3,
            // },
            // {
            //     question: "機車照後鏡之使用，何者不適當？",
            //     options: [
            //         "1. 行進中與前車距離很近時，需觀看照後鏡以利超車",
            //         "2. 行駛前應將照後鏡調整至容易觀察後方車輛或道路狀況之角度與位置",
            //         "3. 可利用等待紅燈時間調整照後鏡。",
            //     ],
            //     answer: 1,
            // },
            {
                question: '騎乘機車至商店購物時應？',
                options: [
                    '1. 先將機車在指定停放位置停妥後再進入店中購物',
                    '2. 停在路邊大聲呼叫店員將物品送來',
                    '3. 任意停在商店門口櫃檯前或行人道中。',
                ],
                answer: 1,
            },
            {
                question:
                    '駕駛人駕車行駛人行道，或經行人穿越道不依規定讓行人優先通行，因而\n致人受傷或死亡，依法應負刑事責任者加重其刑至？',
                options: ['1. 一倍', '2. 二倍', '3. 二分之一。'],
                answer: 3,
            },
            {
                question: '行近行人穿越道時，應？',
                options: ['1. 減速慢行，遇有行人穿越，應暫停讓行人先行', '2. 鳴喇叭穿越通過', '3. 加速通過。'],
                answer: 1,
            },
        ]

        this.currentQuestion = null

        this.optionButtons = []

        this.selectedOptionIndex = 0

        this.usedQuestions = new Set()
    }

    setup = () => {
        this._questionBg = loadImage('../images/other/Choose_bg.png')
    }

    handleKeyPress() {
        if (keyIsDown(UP_ARROW)) {
            this.selectedOptionIndex = Math.max(0, this.selectedOptionIndex - 1)
        } else if (keyIsDown(DOWN_ARROW)) {
            this.selectedOptionIndex = Math.min(this.currentQuestion.options.length - 1, this.selectedOptionIndex + 1)
        }
    }

    createOptionButtons = (eventID) => {
        this.optionButtons.forEach((button) => button.remove())
        this.optionButtons = []

        textSize(18)

        const buttonDiv = createDiv()
        buttonDiv.class('optionButtonDiv')
        const divWidth = windowWidth * 0.2
        buttonDiv.style('width', divWidth + 'px')
        // const leftPosition = windowWidth * 0.375 - divWidth / 2;
        const leftPosition = windowWidth * 0.4 - divWidth / 2

        buttonDiv.style('left', leftPosition + 'px')

        this.currentQuestion.options.forEach((option, index) => {
            const contextWidth = textWidth(option) + 20

            const button = createButton(option)
            button.parent(buttonDiv)
            button.style('width', contextWidth + 'px')
            button.style('background-color', 'transparent')
            button.style('border', 'none')
            button.style('color', '#C1C1C1')
            button.style('font-family', 'NaniFont')
            button.style('font-size', '16px')
            button.style('text-align', 'left')

            button.mousePressed(() => {
                allSounds.get('button').play()
                this.handleOptionSelect(index + 1, eventID)
            })

            button.mouseOver(() => {
                button.style('color', '#FFF')
                button.style('text-decoration', 'underline')
                button.style('cursor', 'pointer')
            })
            button.mouseOut(() => {
                button.style('color', '#C1C1C1')
                button.style('text-decoration', 'none')
                button.style('cursor', 'default')
            })

            this.optionButtons.push(button)
        })
    }

    handleOptionSelect = (selectedIndex, eventID) => {
        if (selectedIndex === this.currentQuestion.answer) {
            this.optionButtons.forEach((button) => button.remove())
            this.optionButtons = []
            eventManager.successEvent(eventID)
        } else {
            this.optionButtons.forEach((button) => button.remove())
            this.optionButtons = []
            eventManager.failEvent(eventID)
        }
    }

    getRandomQuestion = (eventID) => {
        let randomIndex
        let attempts = 0

        do {
            randomIndex = Math.floor(Math.random() * this.questions.length)
            attempts++
        } while (this.usedQuestions.has(randomIndex) && attempts < this.questions.length)

        if (attempts >= this.questions.length) {
            this.usedQuestions.clear()
        } else {
            this.usedQuestions.add(randomIndex)
        }

        this.currentQuestion = this.questions[randomIndex]
        this.createOptionButtons(eventID)
        return this.currentQuestion
    }

    showQuestion = ({ greeting }) => {
        let xCurrPosi = (gameManager.getRoadXRange()[0] + gameManager.getRoadXRange()[1]) / 2
        let yCurrPosi = (gameManager.getVisibleYRange()[0] + gameManager.getVisibleYRange()[1]) / 2
        const isMultiLine = this.currentQuestion.question.split('\n').length >= 1

        this.handleKeyPress()

        rectMode(CENTER)
        imageMode(CENTER)
        image(this._questionBg, xCurrPosi, yCurrPosi, 800, isMultiLine ? 450 : 400)

        textFont(naniFontLight)
        textSize(18)
        textAlign(CENTER, CENTER)
        textLeading(20 * 1.5)
        fill(255)
        text(greeting, xCurrPosi, yCurrPosi - 150, 780, 100)

        // 題目
        textFont(naniFontRegular)
        textSize(20)
        text(this.currentQuestion.question, xCurrPosi, yCurrPosi - 80, 780, 100)
    }

    showResult = (qaResult) => {
        let xCurrPosi = (gameManager.getRoadXRange()[0] + gameManager.getRoadXRange()[1]) / 2
        let yCurrPosi = (gameManager.getVisibleYRange()[0] + gameManager.getVisibleYRange()[1]) / 2
        const isMultiLine = this.currentQuestion.question.split('\n').length >= 1

        rectMode(CENTER)
        imageMode(CENTER)
        image(this._questionBg, xCurrPosi, yCurrPosi, 800, isMultiLine ? 450 : 400)

        textFont(naniFontRegular)
        textSize(24)
        textAlign(CENTER, CENTER)
        fill(255)
        text(qaResult ? '答對啦！加分加分' : '叭叭！答錯了餒...', xCurrPosi, yCurrPosi - 105)
        text(
            qaResult
                ? '你真4太聰明了！'
                : `正確答案是：${this.currentQuestion.options[this.currentQuestion.answer - 1]}`,
            xCurrPosi,
            yCurrPosi - 50
        )
    }
}
