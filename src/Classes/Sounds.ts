// export class Sound {
//   walkRigthtAudio: HTMLAudioElement;
//   walkLefttAudio: HTMLAudioElement;
//   KeyAudio: HTMLAudioElement;
//   doorAudio: HTMLAudioElement;
//   doorAudio1: HTMLAudioElement;
//   introAudio: HTMLAudioElement;
//   pickupAudio: HTMLAudioElement;

//   constructor() {
//     this.walkRigthtAudio = new Audio("./assets/sounds/walk.ogg");
//     this.walkLefttAudio = new Audio("./assets/sounds/walk-left.wav");
//     this.KeyAudio = new Audio("./assets/sounds/trophy.wav");
//     this.doorAudio = new Audio("./assets/sounds/door.wav");
//     this.doorAudio1 = new Audio("./assets/sounds/laugh.mp3");
//     this.introAudio = new Audio("./assets/sounds/intro.mp3");
//     this.pickupAudio = new Audio("./assets/sounds/pickup.wav");
//   }

//   playIntro() {
//     this.introAudio.play();
//   }
// }

export class Sound {
  walkRigthtAudio: HTMLAudioElement;
  walkLefttAudio: HTMLAudioElement;
  KeyAudio: HTMLAudioElement;
  doorAudio: HTMLAudioElement;
  doorAudio1: HTMLAudioElement;
  introAudio: HTMLAudioElement;
  pickupAudio: HTMLAudioElement;
  playerDeathAudio: HTMLAudioElement;
  playerShootAudio: HTMLAudioElement;
  playerJump: HTMLAudioElement;

  constructor() {
    this.walkRigthtAudio = new Audio("./assets/sounds/walk.ogg");
    this.walkLefttAudio = new Audio("./assets/sounds/walk-left.wav");
    this.KeyAudio = new Audio("./assets/sounds/trophy.wav");
    this.doorAudio = new Audio("./assets/sounds/door.wav");
    this.doorAudio1 = new Audio("./assets/sounds/laugh.mp3");
    this.introAudio = new Audio("./assets/sounds/intro.mp3");
    this.pickupAudio = new Audio("./assets/sounds/pickup.wav");
    this.playerDeathAudio = new Audio("./assets/sounds/playerdeath.wav");
    this.playerShootAudio = new Audio("./assets/sounds/playersgoot.wav");
    this.playerJump = new Audio("./assets/sounds/jump.wav");
  }

  playIntro() {
    this.introAudio.play();
  }
}
