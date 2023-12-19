"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import { Promise } from 'es6-promise';
//#endregion
//#region pagelayout selectors
var pageLayouts = {
    htmlRoot: document.querySelector("html"),
    mainMenuBtns: document.querySelectorAll(".main-menu button"),
    setupMenuBtns: document.querySelectorAll(".setup-playing-menu button"),
    backBtns: document.querySelectorAll(".flip-card-game .back-btn"),
    goHome: document.querySelector(".playing-page .go-home"),
    playersDiv: document.querySelector(".playing-page .players"),
    blocksDiv: document.querySelector(".playing-page .game-blocks"),
    innerTimer: document.querySelector(".playing-page .inner-timer"),
};
//#endregion
//#region setup Init
var setupInit = {
    cardsType: "icon",
    playerNumbers: 2,
    grid: 18,
    sound: "on",
    timer: 15,
    timerId: 0,
    flipAllTimerId_1: 1,
    flipAllTimerId_2: 2,
    playersClass: ["player-orange", "player-pink", "player-green", "player-yellow"],
    cardsIcons: [],
    cardsNumbers: []
};
window.onload = function () {
    fillCardsIcons();
    fillCardsNumbers();
};
pageLayouts.setupMenuBtns.forEach(function (btnClicked) {
    btnClicked.onclick = function () {
        var _a;
        setupInit[btnClicked.dataset.key || 0] = btnClicked.dataset.value;
        document.querySelectorAll(".".concat((_a = btnClicked.parentElement) === null || _a === void 0 ? void 0 : _a.classList[0], " button")).forEach(function (btn) {
            if (btn.classList.contains("active"))
                btn.classList.remove("active");
        });
        btnClicked.classList.toggle("active");
    };
});
//#endregion
//#region toggle between pages
pageLayouts.mainMenuBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
        var _a, _b;
        (_a = document
            .querySelector(".".concat(btn.dataset.layout))) === null || _a === void 0 ? void 0 : _a.classList.toggle("d-none");
        (_b = document.querySelector(".main-menu")) === null || _b === void 0 ? void 0 : _b.classList.toggle("d-none");
    });
});
pageLayouts.backBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
        var _a, _b;
        (_a = btn.parentElement) === null || _a === void 0 ? void 0 : _a.classList.toggle("d-none");
        (_b = document.querySelector(".main-menu")) === null || _b === void 0 ? void 0 : _b.classList.toggle("d-none");
    });
});
pageLayouts.goHome.addEventListener("click", function () {
    var _a, _b;
    (_a = document.querySelector(".playing-page")) === null || _a === void 0 ? void 0 : _a.classList.toggle("d-none");
    (_b = document.querySelector(".main-menu")) === null || _b === void 0 ? void 0 : _b.classList.toggle("d-none");
    pageLayouts.htmlRoot.className = "";
    pageLayouts.htmlRoot.style.fontSize = "16px";
    pageLayouts.innerTimer.style.width = "".concat(100, "%");
    clearInterval(setupInit.timerId);
    clearInterval(setupInit.flipAllTimerId_1);
    clearTimeout(setupInit.flipAllTimerId_2);
});
//#endregion
//#region classes players / cards
var players = /** @class */ (function () {
    function players(number, className) {
        var _this = this;
        this.number = number;
        this.className = className;
        this.createPlayerDiv = function () {
            _this.div.innerHTML = "<i class=\"fa-solid fa-".concat(_this.number, " playerNum\"></i><span>Player</span>");
            var choses = document.createElement("div");
            choses.classList.add("choses");
            var choseDone = document.createElement("div");
            choseDone.classList.add("choses-done");
            choseDone.innerHTML = "<i class=\"fa-solid fa-check\"></i>";
            _this.spanCorrect.textContent = "0";
            choseDone.append(_this.spanCorrect);
            var choseWrong = document.createElement("div");
            choseWrong.classList.add("choses-wrong");
            choseWrong.innerHTML = "<i class=\"fa-solid fa-xmark\"></i>";
            _this.spanWrong.textContent = "0";
            choseWrong.append(_this.spanWrong);
            choses.append(choseDone, choseWrong);
            _this.div.appendChild(choses);
            _this.div.classList.add("player", "".concat(_this.className));
            pageLayouts.playersDiv.appendChild(_this.div);
        };
        this.incCorrect = function () {
            _this.correct += 2;
            _this.spanCorrect.textContent = "".concat(_this.correct);
            replayMusic(_this.correctAudio);
        };
        this.incWrong = function () {
            _this.wrong++;
            _this.spanWrong.textContent = "".concat(_this.wrong);
            replayMusic(_this.wrongAudio);
        };
        this.correct = 0;
        this.wrong = 0;
        this.div = document.createElement("div");
        this.correctAudio = new Audio("../assets/audios/correct.mp3");
        this.wrongAudio = new Audio("../assets/audios/wrong.mp3");
        this.spanCorrect = document.createElement("span");
        this.spanWrong = document.createElement("span");
        this.createPlayerDiv();
    }
    ;
    return players;
}());
var cards = /** @class */ (function () {
    function cards(id, dataValue) {
        var _this = this;
        this.id = id;
        this.dataValue = dataValue;
        this.createBlockDiv = function () {
            var backFace = setupInit.cardsType == "icon" ? "<i class=\"".concat(setupInit.cardsIcons[_this.dataValue], "\"></i>") : "<span>".concat(setupInit.cardsNumbers[_this.dataValue], "</span>");
            _this.div.innerHTML = "<div class=\"front face\">\n      <i class=\"fa-solid fa-question\"></i>\n    </div>\n    <div class=\"back face\">\n    ".concat(backFace, "      \n    </div>");
            _this.div.className = ("game-block player-pirple");
            // this.div.dataset.value = `${this.dataValue}`;
            // this.div.dataset.id = `${this.id}`;
            _this.div.style.order = "".concat(_this.randomOrder());
            pageLayouts.blocksDiv.append(_this.div);
        };
        this.randomOrder = function () {
            return Math.floor(Math.random() * 200);
        };
        this.div = document.createElement("div");
        this.createBlockDiv();
    }
    return cards;
}());
//#endregion
//#region GoooooPlay
var goPlay = /** @class */ (function () {
    function goPlay() {
        var _this = this;
        this.createPlayers = function () {
            for (var i = 0; i < setupInit.playerNumbers; i++) {
                _this.playersData[i] = new players(i + 1, setupInit.playersClass[i]);
            }
        };
        this.createBlocks = function () {
            var t = 2;
            while (t--) {
                for (var i = 0; i < setupInit.grid; i++) {
                    _this.blocksData[_this.cardsCount] = new cards(_this.cardsCount++, i);
                }
            }
        };
        this.makeInit = function () {
            pageLayouts.playersDiv.innerHTML = "";
            pageLayouts.blocksDiv.innerHTML = "";
            pageLayouts.blocksDiv.classList.add("no-clicking");
            pageLayouts.innerTimer.className = "inner-timer bGplayer-pirple";
            setupInit.playersClass = shuffle(setupInit.playersClass);
            setupInit.cardsIcons = shuffle(setupInit.cardsIcons);
            setupInit.cardsNumbers = shuffle(setupInit.cardsNumbers);
            clearInterval(setupInit.timerId);
        };
        this.flipAllCardsFirstTimeThenPlay = function () {
            //this function need more profecianl work
            var rndm = [];
            for (var i = 0; i < setupInit.grid * 2; i++)
                rndm[i] = i;
            rndm = shuffle(rndm); //need to change 
            // let pr = new Promise((resolve) : void=>{
            //           resolve(true);
            //   })
            //   pr.then(()=>{
            //     let cntDown = setupInit.grid * 2 - 1;  
            //     setupInit.flipAllTimerId_1 = setInterval(() => {
            //     this.blocksData[rndm[cntDown--]].div.classList.add("is-flipped");
            //     if (cntDown < 0)
            //     clearInterval(setupInit.flipAllTimerId_1);        
            //     }, 300);
            //   }).then(()=>{
            //     setupInit.flipAllTimerId_2 = setTimeout(() => {
            //       this.blocksData.forEach((card) => {
            //         card.div.classList.remove("is-flipped")
            //       });
            //       // clearTimeout(setupInit.flipAllTimerId_2);        
            //     }, 1000);  
            //   }).then(()=>{
            //     this.play();
            //   })
            var cntDown = setupInit.grid * 2 - 1;
            setupInit.flipAllTimerId_1 = setInterval(function () {
                _this.blocksData[rndm[cntDown--]].div.classList.add("is-flipped");
                if (cntDown < 0)
                    clearInterval(setupInit.flipAllTimerId_1);
            }, 300);
            //hide all
            setupInit.flipAllTimerId_2 = setTimeout(function () {
                _this.blocksData.forEach(function (card) {
                    card.div.classList.remove("is-flipped");
                });
                _this.play(); ////need to be promise
            }, 300 * setupInit.grid * 2 + 1000);
        };
        this.addClickonBlocks = function () {
            var that = _this;
            _this.blocksData.forEach(function (card) {
                card.div.addEventListener("click", function () {
                    card.div.classList.add("is-flipped");
                    if (!that.selectOne) {
                        that.cardOneIndx = card.id;
                        that.selectOne = true;
                    }
                    else {
                        that.selectOne = false;
                        that.cardTwoIndx = card.id;
                        pageLayouts.blocksDiv.classList.add("no-clicking");
                        that.checkCorrectTwo();
                    }
                });
            });
        };
        this.checkCorrectTwo = function () {
            if (_this.blocksData[_this.cardOneIndx].dataValue == _this.blocksData[_this.cardTwoIndx].dataValue)
                _this.makeCorrect();
            else {
                setTimeout(function () {
                    _this.makeWrong();
                }, 500);
            }
        };
        this.play = function () {
            pageLayouts.blocksDiv.classList.remove("no-clicking");
            _this.playersData[_this.playerActive].div.classList.add("active");
            pageLayouts.innerTimer.className = "inner-timer bG".concat(_this.playersData[_this.playerActive].className);
            _this.timerPlay();
        };
        this.makeCorrect = function () {
            pageLayouts.blocksDiv.classList.remove("no-clicking");
            _this.playersData[_this.playerActive].incCorrect();
            _this.blocksData[_this.cardOneIndx].div.className = "game-block is-flipped ".concat(_this.playersData[_this.playerActive].className);
            _this.blocksData[_this.cardTwoIndx].div.className = "game-block is-flipped ".concat(_this.playersData[_this.playerActive].className);
            _this.cardsCount -= 2;
            _this.cardOneIndx = -1;
            _this.cardTwoIndx = -1;
            if (_this.cardsCount == 0)
                _this.gameFinish();
        };
        this.makeWrong = function () {
            pageLayouts.blocksDiv.classList.remove("no-clicking");
            _this.playersData[_this.playerActive].incWrong();
            _this.nextPlayer();
        };
        this.nextPlayer = function () {
            if (_this.cardOneIndx >= 0)
                _this.blocksData[_this.cardOneIndx].div.className = "game-block player-pirple";
            if (_this.cardTwoIndx >= 0)
                _this.blocksData[_this.cardTwoIndx].div.className = "game-block player-pirple";
            _this.selectOne = false;
            _this.playersData[_this.playerActive].div.classList.remove("active");
            _this.playerActive = ++_this.playerActive % _this.playersData.length;
            _this.playersData[_this.playerActive].div.classList.add("active");
            pageLayouts.innerTimer.className = "inner-timer bG".concat(_this.playersData[_this.playerActive].className);
            pageLayouts.innerTimer.style.width = "".concat(100, "%");
            _this.timerPlay();
        };
        this.timerPlay = function () {
            if (setupInit.playerNumbers > 1) {
                clearInterval(setupInit.timerId);
                var current_1 = setupInit.timer;
                setupInit.timerId = setInterval(function () {
                    current_1 -= 0.5;
                    pageLayouts.innerTimer.style.width = "".concat((current_1 / setupInit.timer) * 100, "%");
                    if (current_1 == 0)
                        _this.nextPlayer();
                }, 500);
            }
        };
        this.gameFinish = function () {
            clearInterval(setupInit.timerId);
            replayMusic(_this.gameFinishAudio);
            if (!pageLayouts.blocksDiv.classList.contains("no-clicking"))
                pageLayouts.blocksDiv.classList.add("no-clicking");
        };
        this.makeInit();
        this.playersData = [];
        this.playerActive = 0;
        this.blocksData = [];
        this.cardsCount = 0;
        this.cardOneIndx = 0;
        this.cardTwoIndx = 0;
        this.createPlayers();
        this.createBlocks();
        this.addClickonBlocks();
        this.selectOne = false;
        this.gameFinishAudio = new Audio("../assets/audios/game-finish.mp3");
    }
    return goPlay;
}());
//#endregion
//#region Start Game
pageLayouts.mainMenuBtns[0].addEventListener("click", function () {
    changeGameBlocksSize();
    var newPlay = new goPlay();
    newPlay.flipAllCardsFirstTimeThenPlay();
});
//#endregion
//#region helper functions
function fillCardsNumbers() {
    for (var i = 0; i < 100; i++)
        setupInit.cardsNumbers[i] = i;
}
function fillCardsIcons() {
    var myRequset = new XMLHttpRequest();
    myRequset.open("GET", "../assets/icons/fontawesomeIcons.json", true);
    myRequset.send();
    myRequset.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            setupInit.cardsIcons = JSON.parse(this.responseText);
        }
    };
}
function changeGameBlocksSize() {
    pageLayouts.htmlRoot.className = "htmlClass-".concat(Math.sqrt(2 * setupInit.grid));
    pageLayouts.htmlRoot.style.fontSize = (setupInit.grid == 8) ? "13px" : setupInit.grid == 18 ? "11px" : "10px";
}
function replayMusic(aud) {
    if (setupInit.sound == "on") {
        aud.currentTime = 0;
        aud.play();
    }
}
function shuffle(words) {
    var _a;
    var curIndex = words.length;
    var ranIndex;
    // While there remain elements to shuffle.
    while (curIndex > 0) {
        // Pick a remaining element.
        ranIndex = Math.floor(Math.random() * curIndex);
        curIndex--;
        // And swap it with the current element using destruction
        _a = [words[ranIndex], words[curIndex]], words[curIndex] = _a[0], words[ranIndex] = _a[1];
    }
    return words;
}
function helperSortWords(a, b) {
    return a.words < b.words
        ? 1
        : a.words > b.words
            ? -1
            : a.acc < b.acc
                ? 1
                : a.acc > b.acc
                    ? -1
                    : 0;
}
//#endregion
