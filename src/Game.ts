import { Bullet } from "./Bullet";
import { Character } from "./Character";
import { TILE_SIZE, canvasHeight, canvasWidth, edibleTiles, enemies, harmingTiles, solidTiles } from "./constant";
import { Level_complete } from "./levels";
import { Score } from "./Score";
import { SolidTile } from "./tiles/SolidTile";
import { EdibleTile } from "./tiles/edibleTIle";
import { HarmingTile } from "./tiles/harmingTiles";
import { Enemy } from "./Enemy";

class Game {
  private gameCanvas: HTMLCanvasElement;
  private gameCtx: CanvasRenderingContext2D;
  private dave: Character;

  public score: Score | undefined;
  private currentLevel: number;
  private map: string[][];
  private view: { x: number; y: number; width: number; height: number };
  paused: boolean;
  private scoreboardHeight: number = 50;
  isLevelComplete: boolean;
  private totalScore: number;
  private frameCount: number = 0;
  private levels: string[][][];

  constructor(levels: string[][][]) {
    this.gameCanvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
    this.gameCtx = this.gameCanvas.getContext("2d")!;
    this.gameCanvas.style.background = "black";
    this.gameCanvas.style.display = "block";
    document.getElementById("editor")!.style.display = "none";
    // TODO :increase the canvas height
    this.gameCanvas.height += this.scoreboardHeight;
    this.currentLevel = 0;
    this.levels = levels;
    this.score = new Score(this.gameCtx);
    this.isLevelComplete = false;
    this.map = this.levels[this.currentLevel];
    this.paused = false;
    this.view = {
      x: 0,
      y: 0,
      width: canvasWidth,
      height: canvasHeight,
    };

    this.dave = new Character({ posX: 0, posY: 0 });
    this.totalScore = 0;
    window.addEventListener("keydown", (event) => {
      if (event.key === "p") {
        this.togglePause();
      }
    });

    this.initializeGame();
  }

  private togglePause() {
    this.paused = !this.paused;
    if (!this.paused) {
      this.gameLoop();
    } else {
      this.pauseScreen();
    }
  }

  private pauseScreen() {
    this.gameCtx.fillStyle = "rgba(0, 0, 0, 0.5)";
    this.gameCtx.fillRect(0, 0, this.gameCanvas.width, this.gameCanvas.height);
    this.gameCtx.font = "24px 'Press Start 2P'";
    this.gameCtx.fillStyle = "white";
    // this.gameCtx.textAlign = "center";
    this.gameCtx.fillText("Paused", this.gameCanvas.width / 2, this.gameCanvas.height / 2);

    this.gameCtx.fillText("Press P to resume again", this.gameCanvas.width / 1.8, this.gameCanvas.height / 1.5);
  }

  private initializeGame() {
    this.initializeTiles(this.map);
    this.setCharacterPosition();
    this.renderGame();
    window.requestAnimationFrame(this.gameLoop.bind(this));
  }

  private scoreSection() {
    this.gameCtx.fillStyle = "#000000 ";
    this.gameCtx.fillRect(30, 0, this.gameCanvas.width, this.scoreboardHeight);
    this.score?.updateDisplay(this.dave.score, this.currentLevel, this.dave.lives, this.dave.levelUpMessage);
  }

  private footerSection() {
    this.gameCtx.fillStyle = "black";
    this.gameCtx.fillRect(
      0,
      this.gameCanvas.height - this.scoreboardHeight,
      this.gameCanvas.width,
      this.scoreboardHeight
    );

    this.gameCtx.fillStyle = "white";
    this.gameCtx.font = "bold 24px Arial";
    this.gameCtx.fillText(this.dave.utilityMessage, 400, this.gameCanvas.height - 20);
  }

  private setCharacterPosition() {
    for (let y = 0; y < this.map.length; y++) {
      for (let x = 0; x < this.map[y].length; x++) {
        if (this.map[y][x] === "DA") {
          this.dave = new Character({
            posX: x * TILE_SIZE,
            posY: y * TILE_SIZE + this.scoreboardHeight,
          });
          this.dave.score = this.totalScore;
          return;
        }
      }
    }
  }

  private initializeTiles(map: string[][]) {
    solidTiles.length = 0;
    edibleTiles.length = 0;
    harmingTiles.length = 0;

    for (let y = 0; y < map.length; y++) {
      for (let x = 0; x < map[y].length; x++) {
        if (map[y][x] && map[y][x] !== "DA") {
          const tile = map[y][x]!;
          let spriteX: number, spriteY: number;
          let type: string;

          switch (tile) {
            case "Bl":
              [spriteX, spriteY] = [0, 5];
              type = "solid";
              break;
            case "R":
              [spriteX, spriteY] = [1, 0];
              type = "solid";
              break;
            case "P":
              [spriteX, spriteY] = [2, 0];
              type = "solid";
              break;
            case "K":
              [spriteX, spriteY] = [3, 0];
              type = "solid";
              break;
            case "L":
              [spriteX, spriteY] = [4, 0];
              type = "solid";
              break;

            case "T":
              [spriteX, spriteY] = [5, 0];
              type = "solid";
              break;
            case "S":
              [spriteX, spriteY] = [4, 8];
              type = "solid";
              break;
            case "D":
              [spriteX, spriteY] = [0, 1];
              type = "D";
              break;
            case "Sp":
              [spriteX, spriteY] = [2, 5];
              type = "Sp";
              break;
            case "RD":
              [spriteX, spriteY] = [1, 1];
              type = "RD";
              break;
            case "G":
              [spriteX, spriteY] = [3, 1];
              type = "Gun";
              break;
            case "RNG":
              [spriteX, spriteY] = [4, 1];
              type = "RNG";
              break;
            case "Key":
              [spriteX, spriteY] = [5, 1];
              type = "Key";
              break;
            case "C":
              [spriteX, spriteY] = [6, 1];
              type = "C";
              break;

            case "J":
              [spriteX, spriteY] = [8, 1];
              type = "jetpack";
              break;
            case "Y":
              [spriteX, spriteY] = [7, 1];
              type = "Y";
              break;
            case "J":
              [spriteX, spriteY] = [8, 1];
              type = "J";
              break;
            case "E":
              [spriteX, spriteY] = [1, 8];
              type = "door";
              break;
            case "F":
              [spriteX, spriteY] = [0, 5];
              type = "Fire";
              break;
            case "TE":
              [spriteX, spriteY] = [0, 6];
              type = "Tentacles";
              break;
            case "W":
              [spriteX, spriteY] = [0, 7];
              type = "Water";
              break;
            default:
              [spriteX, spriteY] = [0, 0];
              type = "pickable";
              break;
          }

          if (type === "solid") {
            let tile1 = new SolidTile(spriteX, spriteY, x * TILE_SIZE, y * TILE_SIZE + this.scoreboardHeight, 64, 64);
            solidTiles.push(tile1);
          } else if (type === "Fire" || type === "Tentacles" || type === "Water") {
            let tile3 = new HarmingTile(
              spriteX,
              spriteY,
              x * TILE_SIZE,
              y * TILE_SIZE + this.scoreboardHeight,
              type,
              64,
              64,
              type === "Water" ? 3 : 4,
              10
            );
            harmingTiles.push(tile3);
          } else if (type === "Sp") {
            let tile3 = new Enemy(x * TILE_SIZE, y * TILE_SIZE);
            console.log("tile spider", tile3);
            enemies.push(tile3);
            console.log("enemies", enemies);
          } else {
            let tile2 = new EdibleTile(
              spriteX,
              spriteY,
              x * TILE_SIZE,
              y * TILE_SIZE + this.scoreboardHeight,
              type,
              64,
              64
            );

            tile2.scorevalue();
            edibleTiles.push(tile2);
          }
        }
      }
    }
  }

  private isInDoor() {
    if (this.dave.collectedItem.door) {
      this.totalScore = this.dave.score;
      if (this.currentLevel < this.levels.length - 1) {
        if (this.map.some((row) => row.includes("E"))) {
          this.showLevelComplete();
        } else {
          this.currentLevel++;
          this.loadlevel();
        }
      } else {
        console.log("all levels completed");
      }
    }
  }

  private loadlevel() {
    this.map = this.levels[this.currentLevel];
    this.initializeTiles(this.map);
    this.setCharacterPosition();
    this.dave.isDoor = false;

    this.gameCtx.clearRect(0, 0, this.gameCanvas.width, this.gameCanvas.height);
    this.renderGame();
  }

  private renderTiles() {
    const viewPortWidth = TILE_SIZE * 19;
    this.view.x = Math.floor(this.dave.posX / viewPortWidth) * viewPortWidth;

    for (const tile of solidTiles) {
      tile.draw(this.gameCtx, tile.x - this.view.x, tile.y, TILE_SIZE, TILE_SIZE);
    }
    for (const tile of edibleTiles) {
      if (!tile.consumed) {
        tile.draw(this.gameCtx, tile.x - this.view.x, tile.y, TILE_SIZE, TILE_SIZE);
      }
    }

    for (const tile of harmingTiles) {
      tile.draw(this.gameCtx, tile.x - this.view.x, tile.y, TILE_SIZE, TILE_SIZE);
    }

    for (const enemy of enemies) {
      enemy.draw(this.gameCtx, this.view.x, this.view.y);
    }
  }

  private renderGame() {
    this.renderTiles();
    this.dave.draw(this.gameCtx, this.view.x, this.view.y);

    // this.dave.bullets.forEach((bullet, index) => {
    //   if (bullet.isActive) {
    //     console.log("bullet", bullet);
    //     console.log("bullet is active", index);
    //     bullet.draw(this.gameCtx, this.view.x, this.view.y);
    //     bullet.update();
    //   }
    // });
    this.dave.bullets.forEach((bullet) => {
      if (bullet.isActive) {
        bullet.draw(this.gameCtx, this.view.x, this.view.y);
        bullet.update();
        enemies.forEach((enemy, enemyIndex) => {
          if (bullet.checkCollision(enemy)) {
            console.log("bullet collided with the enemy");
            bullet.isActive = false;
            enemies.splice(enemyIndex, 1);
          }
        });
      }
    });
  }

  private gameLoop() {
    if (this.paused) {
      return;
    }

    this.gameCtx.clearRect(0, 0, this.gameCanvas.width, this.gameCanvas.height);

    if (this.dave.gameOver) {
      this.gameCtx.fillStyle = "black";
      this.gameCtx.fillRect(canvasWidth / 2, canvasHeight / 2, 300, 300);
      this.gameCtx.font = "48px Arial";
      this.gameCtx.fillStyle = "white ";
      this.gameCtx.textAlign = "center";
      this.gameCtx.fillText("Game Over", canvasWidth / 2, canvasHeight / 2);
      this.gameCtx.fillText(`Your total score is ${this.dave.score}`, canvasWidth / 1.9, canvasHeight / 1.5);

      return;
    }

    enemies.forEach((enemy: Enemy) => {
      enemy.update();
    });

    this.scoreSection();
    this.footerSection();
    this.isInDoor();
    this.dave.update();

    this.renderGame();

    if (this.dave.reachedEndMap) {
      this.showLevelComplete();
    }

    this.frameCount++;
    window.requestAnimationFrame(this.gameLoop.bind(this));
  }

  private showLevelComplete() {
    if (this.dave.reachedEndMap) {
      this.currentLevel++;
      if (this.currentLevel < this.levels.length) {
        this.loadlevel();
      } else {
        this.dave.velX = 0;
        this.isLevelComplete = true;
      }
    } else {
      this.map = Level_complete;
      this.isLevelComplete = true;
      this.initializeTiles(this.map);
      this.setCharacterPosition();
      this.dave.isDoor = false;

      this.gameCtx.clearRect(0, 0, this.gameCanvas.width, this.gameCanvas.height);
      this.renderGame();
      this.dave.moveCharacterAutomatically();
    }
  }
}

export { Game };
