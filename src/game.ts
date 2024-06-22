import { Character } from "./character";
import { TILE_SIZE, edibleTiles, harmingTiles, solidTiles } from "./constant";
import { Level_complete } from "./levels";
import { Score } from "./score";
import { SolidTile } from "./tiles/SolidTile";
import { EdibleTile } from "./tiles/edibleTIle";
import { HarmingTile } from "./tiles/harmingTiles";
class Game {
  private levels: any;
  private gameCanvas: HTMLCanvasElement;
  private gameCtx: CanvasRenderingContext2D;
  private dave: Character;
  public score: Score | undefined;
  private currentLevel: number;
  private map: string[][];
  isDoor: boolean;
  private scoreboardHeight: number = 50;
  isLevelComplete: boolean;
  private totalScore: number;
  private frameCount: number = 0;

  constructor(levels: any) {
    this.gameCanvas = document.getElementById(
      "gameCanvas"
    ) as HTMLCanvasElement;
    this.gameCtx = this.gameCanvas.getContext("2d")!;
    this.gameCanvas.style.background = "black";
    this.gameCanvas.height += this.scoreboardHeight;
    this.currentLevel = 0;
    this.levels = levels;

    this.score = new Score(this.gameCtx);
    this.isLevelComplete = false;

    document.getElementById("editor")!.style.display = "none";
    document.getElementById("gameCanvas")!.style.display = "block";

    this.map = this.levels[this.currentLevel];

    this.isDoor = false;
    this.dave = new Character({ posX: 0, posY: 0, solidTiles, edibleTiles });
    this.totalScore = 0;
    this.initializeGame();
  }

  private initializeGame() {
    this.initializeTiles(this.map);
    this.setCharacterPosition();
    this.renderGame();
    window.requestAnimationFrame(this.gameLoop.bind(this));
  }

  private scoreSection() {
    this.gameCtx.fillStyle = "black";
    this.gameCtx.fillRect(0, 0, this.gameCanvas.width, this.scoreboardHeight);
    this.score?.updateDisplay(
      this.dave.score,
      this.currentLevel,
      this.dave.lives,
      this.dave.levelUpMessage
    );
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
    this.gameCtx.fillText(
      this.dave.utilityMessage,
      400,
      this.gameCanvas.height - 20
    );
  }

  private setCharacterPosition() {
    for (let y = 0; y < this.map.length; y++) {
      for (let x = 0; x < this.map[y].length; x++) {
        if (this.map[y][x] === "DA") {
          this.dave = new Character({
            posX: x * TILE_SIZE,
            posY: y * TILE_SIZE + this.scoreboardHeight,
            solidTiles,
            edibleTiles,
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
            case "B":
              [spriteX, spriteY] = [0, 0];
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
            case "D":
              [spriteX, spriteY] = [0, 1];
              type = "D";
              break;
            case "RD":
              [spriteX, spriteY] = [1, 1];
              type = "RD";
              break;
            case "G":
              [spriteX, spriteY] = [3, 1];
              type = "G";
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
            let tile1 = new SolidTile(
              spriteX,
              spriteY,
              x * TILE_SIZE,
              y * TILE_SIZE + this.scoreboardHeight,
              64,
              64
            );
            solidTiles.push(tile1);
          } else if (
            type === "Fire" ||
            type === "Tentacles" ||
            type === "Water"
          ) {
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
            console.log("Created harming tile:", tile3);
            console.log("pushed successfully");
            harmingTiles.push(tile3);
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

    console.log("Final harming tiles array:", harmingTiles);
  }

  private isInDoor() {
    if (this.dave.isDoor) {
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
    for (const tile of solidTiles) {
      tile.draw(this.gameCtx, tile.x, tile.y, TILE_SIZE, TILE_SIZE);
    }
    for (const tile of edibleTiles) {
      if (!tile.consumed) {
        tile.draw(this.gameCtx, tile.x, tile.y, TILE_SIZE, TILE_SIZE);
      }
    }

    for (const tile of harmingTiles) {
      tile.draw(this.gameCtx, tile.x, tile.y, TILE_SIZE, TILE_SIZE);
    }
  }

  private renderGame() {
    this.renderTiles();
    this.dave.draw(this.gameCtx, TILE_SIZE, TILE_SIZE);
  }

  private gameLoop() {
    this.gameCtx.clearRect(0, 0, this.gameCanvas.width, this.gameCanvas.height);

    this.isInDoor();
    this.scoreSection();
    this.footerSection();
    this.dave.update();

    this.renderGame();

    if (this.dave.reachedEndMap) {
      this.showLevelComplete();
    }

    // Increment frame count for animation
    this.frameCount++;

    window.requestAnimationFrame(this.gameLoop.bind(this));
  }

  private showLevelComplete() {
    if (this.dave.reachedEndMap) {
      console.log("Dave has reached the end of the map");
      this.currentLevel++;
      if (this.currentLevel < this.levels.length) {
        this.loadlevel();
      } else {
        console.log("All levels completed");
        this.dave.velX = 0;
        this.isLevelComplete = true;
      }
    } else {
      this.map = Level_complete;
      this.isLevelComplete = true;
      this.initializeTiles(this.map);
      this.setCharacterPosition();
      this.dave.isDoor = false;

      this.gameCtx.clearRect(
        0,
        0,
        this.gameCanvas.width,
        this.gameCanvas.height
      );
      this.renderGame();
      this.dave.moveCharacterAutomatically();
    }
  }
}

export { Game };
