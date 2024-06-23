import { mainGameLevels } from "./levels";
import { Game } from "./Game";

class MainGame {
  constructor() {
    document.getElementById("splashScreen")!.style.display = "none";
    console.log(mainGameLevels);

    new Game(mainGameLevels);
  }
}

export { MainGame };
