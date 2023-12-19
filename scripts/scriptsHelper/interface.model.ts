
//#region start layouts
export interface ILayouts {
    htmlRoot : HTMLElement,
    mainMenuBtns : any;
    setupMenuBtns : any;
    backBtns : any;
    goHome : HTMLImageElement;
    playersDiv : HTMLDivElement;
    blocksDiv : HTMLDivElement;
    innerTimer : HTMLDivElement;
  }
//#endregion  

//#region setup  
export interface ISetupInit {
  cardsType : string,
  playerNumbers : number,
  grid : number,
  sound : string,
  timer : number,
  timerId : number,
  flipAllTimerId_1 : number,
  flipAllTimerId_2 : number,
  playersClass: string[],
  cardsIcons : string[],
  cardsNumbers: number[]
}
//#endregion

//#region classes Interface
export interface IPlayer{
  number : number,
  className : string,
  div : HTMLDivElement,
  spanCorrect : HTMLSpanElement,
  spanWrong : HTMLSpanElement,
  correctAudio: HTMLAudioElement;
  wrongAudio: HTMLAudioElement;
  correct : number,
  wrong: number,
  createPlayerDiv : () => void,
  incCorrect : () => void,
  incWrong : () => void,
}

export interface ICard{
  div : HTMLDivElement,
  dataValue : number,
  id : number,
  createBlockDiv : () => void,
  randomOrder : () => number
}

export interface IGoPlay{
  playersData : IPlayer[],
  playerActive : number,
  blocksData : ICard[],
  cardsCount : number,
  selectOne : boolean,
  cardOneIndx : number,
  cardTwoIndx : number,
  gameFinishAudio: HTMLAudioElement;
  createPlayers : () => void,
  createBlocks : () => void,
  flipAllCardsFirstTimeThenPlay : () => void,
  addClickonBlocks : () => void,
  checkCorrectTwo : () => void,
  makeInit : () => void,
  play : () => void,
  nextPlayer : () => void,
  makeWrong : () => void,
  makeCorrect : () => void,
  timerPlay : () => void,
  gameFinish : () => void,
}
//#endregion classes Interface
