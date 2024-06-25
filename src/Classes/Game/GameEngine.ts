import { Character } from "../Character";
import { TILE_SIZE, canvasHeight, canvasWidth } from "../../constant";
import { Level_complete } from "../../levels";
import { Score } from "../Score";
import { SolidTile } from "../tiles/SolidTile";
import { EdibleTile } from "../tiles/EdibleTile";
import { HarmingTile } from "../tiles/HarmingTiles";
import { Enemy } from "../Enemy";
import { tileProperties } from "../tiles/tileProperties";
import { combineMaps, distance } from "../../utility";
import { Bullet } from "../Bullet";
interface Tiles {
  solid: SolidTile[];
  edible: EdibleTile[];
  harming: HarmingTile[];
}

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
  combinedLevelMap: string[][];

  private tiles: Tiles = {
    solid: [],
    edible: [],
    harming: [],
  };

  private enemies: Enemy[] = [];

  constructor(levels: string[][][]) {
    this.gameCanvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
    this.gameCtx = this.gameCanvas.getContext("2d")!;
    this.gameCanvas.style.background = "black";
    this.gameCanvas.style.display = "block";
    document.getElementById("editor")!.style.display = "none";
    this.gameCanvas.height += this.scoreboardHeight;
    this.currentLevel = 0;
    this.levels = levels;
    this.score = new Score(this.gameCtx);
    this.isLevelComplete = false;
    this.map = this.levels[this.currentLevel];
    console.log("map", this.map);

    this.combinedLevelMap = combineMaps(...levels);
    console.log(this.combinedLevelMap);
    this.paused = false;
    this.view = {
      x: 0,
      y: 0,
      width: canvasWidth,
      height: canvasHeight,
    };

    this.dave = new Character({ posX: 0, posY: 0 }, this.tiles);
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
          this.dave = new Character(
            {
              posX: x * TILE_SIZE,
              posY: y * TILE_SIZE + this.scoreboardHeight,
            },
            this.tiles
          );

          this.dave.score = this.totalScore;
          this.dave.initalposX = x * TILE_SIZE;
          this.dave.initalposY = y * TILE_SIZE;
        }
      }
    }
  }

  private initializeTiles(map: string[][]) {
    this.tiles.solid.length = 0;
    this.tiles.edible.length = 0;
    this.tiles.harming.length = 0;

    for (let y = 0; y < map.length; y++) {
      for (let x = 0; x < map[y].length; x++) {
        if (map[y][x] && map[y][x] !== "DA") {
          const tileKey = map[y][x];
          const config = tileProperties[tileKey] || tileProperties["default"];
          console.log("properties", tileProperties[tileKey]);
          console.log("key", tileKey);
          console.log(tileProperties["default"], config);
          let { spriteX, spriteY, type } = config;

          if (type === "solid") {
            let tile1 = new SolidTile(spriteX, spriteY, x * TILE_SIZE, y * TILE_SIZE + this.scoreboardHeight, 64, 64);
            this.tiles.solid.push(tile1);
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
            this.tiles.harming.push(tile3);
          } else if (type === "Sp") {
            let tile3 = new Enemy(x * TILE_SIZE, y * TILE_SIZE);
            this.enemies.push(tile3);
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
            this.tiles.edible.push(tile2);
          }
        }
      }
    }
  }

  private displayGameOverRectangle() {
    const canvasWidth = this.gameCtx.canvas.width;
    const canvasHeight = this.gameCtx.canvas.height;
    const rectWidth = 300;
    const rectHeight = 150;
    const rectX = (canvasWidth - rectWidth) / 2;
    const rectY = (canvasHeight - rectHeight) / 2;

    this.gameCtx.fillStyle = "rgba(0, 0, 0, 0.75)";
    this.gameCtx.fillRect(rectX, rectY, rectWidth, rectHeight);

    this.gameCtx.strokeStyle = "white";
    this.gameCtx.lineWidth = 5;
    this.gameCtx.strokeRect(rectX, rectY, rectWidth, rectHeight);

    this.gameCtx.fillStyle = "white";
    this.gameCtx.font = "20px Arial";
    this.gameCtx.textAlign = "center";
    this.gameCtx.fillText("Game Over", canvasWidth / 2, rectY + 40);
    this.gameCtx.fillText(`Total Score: ${this.totalScore}`, canvasWidth / 2, rectY + 80);
    this.gameCtx.fillText("Thank you for playing!", canvasWidth / 2, rectY + 120);
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
        this.displayGameOverRectangle();
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

    for (const tile of this.tiles.solid) {
      tile.draw(this.gameCtx, tile.x - this.view.x, tile.y, TILE_SIZE, TILE_SIZE);
    }
    for (const tile of this.tiles.edible) {
      if (!tile.consumed) {
        tile.draw(this.gameCtx, tile.x - this.view.x, tile.y, TILE_SIZE, TILE_SIZE);
      }
    }

    for (const tile of this.tiles.harming) {
      tile.draw(this.gameCtx, tile.x - this.view.x, tile.y, TILE_SIZE, TILE_SIZE);
    }

    for (const enemy of this.enemies) {
      enemy.draw(this.gameCtx, this.view.x, this.view.y);
    }
  }

  private renderGame() {
    this.renderTiles();
    this.dave.draw(this.gameCtx, this.view.x, this.view.y);

    this.dave.bullets.forEach((bullet: Bullet) => {
      if (bullet.isActive) {
        bullet.draw(this.gameCtx, this.view.x, this.view.y);
        bullet.update();
        this.enemies.forEach((enemy, enemyIndex) => {
          if (bullet.checkCollision(enemy)) {
            bullet.isActive = false;
            this.dave.sound.playerDeathAudio.play();
            this.enemies.splice(enemyIndex, 1);
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

    this.enemies.forEach((enemy: Enemy) => {
      if (distance(enemy, this.dave) < 900) {
        enemy.update();
        enemy.bullets.forEach((bullet: Bullet) => {
          if (bullet.isActive) {
            if (bullet.checkCollision(this.dave)) {
              console.log("dave collided");
              bullet.isActive = false;
              this.dave.loselife();
            }
          }
        });
      }
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
      console.log("character postion", this.setCharacterPosition());
      this.dave.isDoor = false;

      this.gameCtx.clearRect(0, 0, this.gameCanvas.width, this.gameCanvas.height);
      this.renderGame();

      this.dave.moveCharacterAutomatically();
    }
  }
}

export { Game };
