import { mainGameLevels } from "./levels";
import { Game } from "./Classes/Game";

class MainGame {
  constructor() {
    document.getElementById("splashScreen")!.style.display = "none";
    console.log(mainGameLevels);

    new Game(mainGameLevels);
  }
}

export { MainGame };
