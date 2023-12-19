//#region imports
import { ICard, IGoPlay, ILayouts, IPlayer, ISetupInit } from "./scriptsHelper/interface.model";
// import { Promise } from 'es6-promise';
//#endregion

//#region pagelayout selectors
const pageLayouts : ILayouts = {
  htmlRoot : document.querySelector("html") as HTMLElement,
  mainMenuBtns : document.querySelectorAll(".main-menu button"),
  setupMenuBtns: document.querySelectorAll(".setup-playing-menu button") as NodeList,  
  backBtns : document.querySelectorAll(".flip-card-game .back-btn") as NodeList,
  goHome : document.querySelector(".playing-page .go-home") as HTMLImageElement,
  playersDiv : document.querySelector(".playing-page .players") as HTMLDivElement,  
  blocksDiv : document.querySelector(".playing-page .game-blocks") as HTMLDivElement,
  innerTimer : document.querySelector(".playing-page .inner-timer") as HTMLDivElement,
};
//#endregion

//#region setup Init
let setupInit: ISetupInit = {
  cardsType: "icon",
  playerNumbers: 2,
  grid: 18,
  sound: "on",
  timer : 15,
  timerId : 0,
  flipAllTimerId_1 : 1,
  flipAllTimerId_2 : 2,
  playersClass:["player-orange","player-pink","player-green","player-yellow"],
  cardsIcons : [],
  cardsNumbers : []
}

window.onload = function(){
  fillCardsIcons();
  fillCardsNumbers();
};

pageLayouts.setupMenuBtns.forEach((btnClicked : HTMLButtonElement)=>{
  btnClicked.onclick = ()=> {
    setupInit[btnClicked.dataset.key || 0] = btnClicked.dataset.value;
    document.querySelectorAll(`.${btnClicked.parentElement?.classList[0]} button`).forEach((btn)=>{
      if(btn.classList.contains("active"))
          btn.classList.remove("active");
    });
    btnClicked.classList.toggle("active");
  }
})
//#endregion

//#region toggle between pages
pageLayouts.mainMenuBtns.forEach((btn : any)=>{
  btn.addEventListener("click", function () {
    document
      .querySelector(`.${btn.dataset.layout}`)
      ?.classList.toggle("d-none");
    document.querySelector(".main-menu")?.classList.toggle("d-none");
  });
})

pageLayouts.backBtns.forEach((btn:any)=>{
  btn.addEventListener("click", function () {
    btn.parentElement?.classList.toggle("d-none");
    document.querySelector(".main-menu")?.classList.toggle("d-none");    
  });
})

pageLayouts.goHome.addEventListener("click", function () {
   document.querySelector(".playing-page")?.classList.toggle("d-none");
   document.querySelector(".main-menu")?.classList.toggle("d-none");    
   pageLayouts.htmlRoot.className = "";
   pageLayouts.htmlRoot.style.fontSize = "16px";
   pageLayouts.innerTimer.style.width = `${100}%`; 
   clearInterval(setupInit.timerId);
   clearInterval(setupInit.flipAllTimerId_1);
   clearTimeout(setupInit.flipAllTimerId_2);
})

//#endregion

//#region classes players / cards
class players implements IPlayer{
  correct : number ;
  wrong : number;
  div: HTMLDivElement;
  spanCorrect: HTMLSpanElement;
  spanWrong: HTMLSpanElement;
  correctAudio: HTMLAudioElement;
  wrongAudio: HTMLAudioElement;
 
  constructor(public number : number, public className : string){
    this.correct = 0;
    this.wrong = 0;
    this.div = document.createElement("div");
    this.correctAudio = new Audio("../assets/audios/correct.mp3");
    this.wrongAudio = new Audio("../assets/audios/wrong.mp3");
    this.spanCorrect = document.createElement("span");
    this.spanWrong = document.createElement("span");
    this.createPlayerDiv();
  };
  createPlayerDiv = () : void => {   
    this.div.innerHTML = `<i class="fa-solid fa-${this.number} playerNum"></i><span>Player</span>`
    let choses: HTMLDivElement = document.createElement("div");
    choses.classList.add("choses");
    let choseDone: HTMLDivElement = document.createElement("div");
    choseDone.classList.add("choses-done");
    choseDone.innerHTML = `<i class="fa-solid fa-check"></i>`;
    this.spanCorrect.textContent = `0`;
    choseDone.append(this.spanCorrect);
    let choseWrong: HTMLDivElement = document.createElement("div");
    choseWrong.classList.add("choses-wrong");
    choseWrong.innerHTML = `<i class="fa-solid fa-xmark"></i>`;
    this.spanWrong.textContent = `0`;
    choseWrong.append(this.spanWrong);
    choses.append(choseDone,choseWrong);
    this.div.appendChild(choses);
    this.div.classList.add("player",`${this.className}`);
    pageLayouts.playersDiv.appendChild(this.div);
  }
  incCorrect = () : void => {
    this.correct += 2;
    this.spanCorrect.textContent = `${this.correct}`;
    replayMusic(this.correctAudio);
  }
  incWrong = () : void => {
    this.wrong++;
    this.spanWrong.textContent = `${this.wrong}`;
    replayMusic(this.wrongAudio);
  }
}

class cards implements ICard{
  div : HTMLDivElement;
  constructor(public id : number, public dataValue: number){
    this.div = document.createElement("div");
    this.createBlockDiv();
  }
  createBlockDiv = () : void => {
    let backFace : string = setupInit.cardsType == "icon" ? `<i class="${setupInit.cardsIcons[this.dataValue]}"></i>` : `<span>${setupInit.cardsNumbers[this.dataValue]}</span>`;

    this.div.innerHTML = `<div class="front face">
      <i class="fa-solid fa-question"></i>
    </div>
    <div class="back face">
    ${backFace}      
    </div>`;
    this.div.className = ("game-block player-pirple");
    // this.div.dataset.value = `${this.dataValue}`;
    // this.div.dataset.id = `${this.id}`;
    this.div.style.order =  `${this.randomOrder()}`;
    pageLayouts.blocksDiv.append(this.div);
  
  }
  randomOrder = () : number =>{
    return Math.floor(Math.random() * 200);
  };
}
//#endregion

//#region GoooooPlay
class goPlay implements IGoPlay {
  playersData: players[];
  playerActive: number;
  blocksData: cards[];
  cardsCount: number;
  cardOneIndx: number;
  cardTwoIndx: number;
  selectOne: boolean;
  gameFinishAudio: HTMLAudioElement;
  constructor(){
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
  createPlayers = () : void => {
    for(let i=0;i<setupInit.playerNumbers;i++){
     this.playersData[i] = new players(i+1, setupInit.playersClass[i]);
    }
   }
   createBlocks = () : void =>{
     let t:number = 2;
     while(t--){
       for(let i=0;i<setupInit.grid;i++){
         this.blocksData[this.cardsCount] = new cards(this.cardsCount++,i);
        }
     }
   }
   makeInit = () : void => {
    pageLayouts.playersDiv.innerHTML ="";
    pageLayouts.blocksDiv.innerHTML = "";
    pageLayouts.blocksDiv.classList.add("no-clicking");
    pageLayouts.innerTimer.className = "inner-timer bGplayer-pirple";
    setupInit.playersClass = shuffle<string>(setupInit.playersClass);
    setupInit.cardsIcons = shuffle<string>(setupInit.cardsIcons);
    setupInit.cardsNumbers = shuffle<number>(setupInit.cardsNumbers);
    clearInterval(setupInit.timerId);
   }
   flipAllCardsFirstTimeThenPlay = () : void => {
    //this function need more profecianl work
      let rndm : number[] = [];
      for(let i=0;i<setupInit.grid*2;i++)
        rndm[i] = i;
      rndm = shuffle<number>(rndm); //need to change 
  
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

      
      let cntDown = setupInit.grid * 2 - 1;  
        setupInit.flipAllTimerId_1 = setInterval(() => {
        this.blocksData[rndm[cntDown--]].div.classList.add("is-flipped");
        if (cntDown < 0) clearInterval(setupInit.flipAllTimerId_1);
        }, 300);
      //hide all
      setupInit.flipAllTimerId_2 = setTimeout(() => {
        this.blocksData.forEach((card) => {
          card.div.classList.remove("is-flipped");
        });
        
        this.play();////need to be promise

      }, 300 * setupInit.grid * 2 + 1000);
   
    }
   addClickonBlocks = () : void => {
    let that = this;
    this.blocksData.forEach((card)=>{
      card.div.addEventListener("click",function(){
        card.div.classList.add("is-flipped");
        if(!that.selectOne)  
          {
            that.cardOneIndx = card.id;
            that.selectOne = true;
          }
        else{
          that.selectOne = false;
          that.cardTwoIndx = card.id;
          pageLayouts.blocksDiv.classList.add("no-clicking");
          that.checkCorrectTwo();
        }
      })
    })
   }
   checkCorrectTwo = ():void => {
      if(this.blocksData[this.cardOneIndx].dataValue == this.blocksData[this.cardTwoIndx].dataValue)
          this.makeCorrect();
      else{
        setTimeout(()=>{
          this.makeWrong();
        },500);
      }
   };
   play = (): void=>{
    pageLayouts.blocksDiv.classList.remove("no-clicking");
    this.playersData[this.playerActive].div.classList.add("active");
    pageLayouts.innerTimer.className = `inner-timer bG${this.playersData[this.playerActive].className}`;
    this.timerPlay();
   }
   makeCorrect = (): void =>{
    pageLayouts.blocksDiv.classList.remove("no-clicking");
    this.playersData[this.playerActive].incCorrect();
    this.blocksData[this.cardOneIndx].div.className =  `game-block is-flipped ${this.playersData[this.playerActive].className}`;
    this.blocksData[this.cardTwoIndx].div.className =  `game-block is-flipped ${this.playersData[this.playerActive].className}`;
    this.cardsCount -= 2;
    this.cardOneIndx = -1;
    this.cardTwoIndx = -1;
    if(this.cardsCount == 0)
      this.gameFinish();
   }
   makeWrong = (): void=>{
    pageLayouts.blocksDiv.classList.remove("no-clicking");
    this.playersData[this.playerActive].incWrong();
    this.nextPlayer();
   }
   nextPlayer = () : void =>{
    if(this.cardOneIndx >=0)
        this.blocksData[this.cardOneIndx].div.className = "game-block player-pirple";
    if(this.cardTwoIndx >=0)
      this.blocksData[this.cardTwoIndx].div.className = "game-block player-pirple"; 
    this.selectOne = false;
    this.playersData[this.playerActive].div.classList.remove("active");
    this.playerActive = ++this.playerActive % this.playersData.length;
    this.playersData[this.playerActive].div.classList.add("active");
    pageLayouts.innerTimer.className = `inner-timer bG${this.playersData[this.playerActive].className}`;
    pageLayouts.innerTimer.style.width = `${100}%`; 
    this.timerPlay();
   }
   timerPlay = () : void =>{
    if(setupInit.playerNumbers> 1){
      clearInterval(setupInit.timerId);
      let current = setupInit.timer;
      setupInit.timerId = setInterval(() => {
        current-= 0.5;
        pageLayouts.innerTimer.style.width = `${(current / setupInit.timer) * 100}%`; 
        if(current == 0)
          this.nextPlayer();
      }, 500);
    }
  }
  gameFinish = () : void =>{
    clearInterval(setupInit.timerId);
    replayMusic(this.gameFinishAudio);
    if(!pageLayouts.blocksDiv.classList.contains("no-clicking"))
      pageLayouts.blocksDiv.classList.add("no-clicking");
  }
}
//#endregion

//#region Start Game
pageLayouts.mainMenuBtns[0].addEventListener("click", function(){
  changeGameBlocksSize();
  let newPlay : goPlay = new goPlay();   
  newPlay.flipAllCardsFirstTimeThenPlay();
})

//#endregion

//#region helper functions
function fillCardsNumbers() : void{
    for(let i=0;i<100;i++)
        setupInit.cardsNumbers[i] = i;  
}

function fillCardsIcons() : void{
  let myRequset : XMLHttpRequest = new XMLHttpRequest();
  myRequset.open("GET", `../assets/icons/fontawesomeIcons.json`, true);
  myRequset.send();
  myRequset.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      setupInit.cardsIcons = JSON.parse(this.responseText);        
    }
  };  
}

function changeGameBlocksSize() : void{
  pageLayouts.htmlRoot.className = `htmlClass-${Math.sqrt(2*setupInit.grid)}`;
  pageLayouts.htmlRoot.style.fontSize = (setupInit.grid == 8) ?`13px` : setupInit.grid == 18 ? `11px` : `10px`;  
}

function replayMusic (aud: HTMLAudioElement) : void {
  if(setupInit.sound == "on"){
    aud.currentTime = 0;
    aud.play();
  }
}

function shuffle<T>(words : T[]) : T[] {
  let curIndex : number = words.length;
  let ranIndex : number;
  // While there remain elements to shuffle.
  while (curIndex > 0) {
    // Pick a remaining element.
    ranIndex = Math.floor(Math.random() * curIndex);
    curIndex--;
    // And swap it with the current element using destruction
    [words[curIndex], words[ranIndex]] = [words[ranIndex],words[curIndex]];
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
