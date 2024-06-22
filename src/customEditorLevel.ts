import { SolidTile } from "./tiles/SolidTile";
import {
  CustomMap,
  CustomMap1,
  LEVEL1_MAP,
  LEVEL2_MAP,
  Level_3Map,
  Level_complete,
} from "./levels";
import { Game } from "./game";
import { Score } from "./score";

const TILE_SIZE = 64;
const DRAW_SIZE = 50;

export function isLevelCompleteMap(level: (string | null)[][]): boolean {
  return (
    level[4] &&
    level[4].every((tile) => tile === "P") &&
    level[5] &&
    level[5][0] === "E" &&
    level[5][1] === "DA"
  );
}

export class CustomEditorLevel {
  private levelNames: string[];
  private mapCanvas: HTMLCanvasElement;
  private mapCtx: CanvasRenderingContext2D;
  private tileSelector: HTMLElement;
  private saveButton: HTMLButtonElement;
  private prevLevelButton: HTMLButtonElement;
  private nextLevelButton: HTMLButtonElement;
  private output: HTMLTextAreaElement;
  private errorDisplay: HTMLElement;
  private successDisplay: HTMLElement;
  private currentTile: string;
  private map: (string | null)[][];
  private tilesetImage: HTMLImageElement;
  // TODO conver this levels any to type
  private levels: any;
  private currentLevelIndex: number;

  constructor() {
    this.mapCanvas = document.getElementById("map") as HTMLCanvasElement;
    this.mapCtx = this.mapCanvas.getContext("2d")!;
    this.tileSelector = document.getElementById("tileSelector") as HTMLElement;
    this.mapCanvas.style.background = "red";
    this.saveButton = document.getElementById("save") as HTMLButtonElement;
    this.prevLevelButton = document.getElementById(
      "previous-level"
    ) as HTMLButtonElement;
    this.nextLevelButton = document.getElementById(
      "next-level"
    ) as HTMLButtonElement;
    this.levelNames = this.levels;
    console.log;

    this.output = document.createElement("textarea");
    this.errorDisplay = document.getElementById("errorDisplay")!;
    this.successDisplay = document.getElementById("successDisplay")!;
    this.currentTile = "B";
    this.levels = [
      LEVEL1_MAP.map((row) => row.map((tile) => (tile === " " ? null : tile))),
      // Level_complete.map((row) =>
      //   row.map((tile) => (tile === " " ? null : tile))
      // ),
      CustomMap.map((row) => row.map((tile) => (tile === " " ? null : tile))),
      CustomMap1.map((row) => row.map((tile) => (tile === " " ? null : tile))),
      Level_3Map.map((row) => row.map((tile) => (tile === " " ? null : tile))),
    ];
    this.currentLevelIndex = 0;
    this.map = this.levels[this.currentLevelIndex];

    this.tilesetImage = new Image();
    this.tilesetImage.src = "assets/sprites/tileset.png";

    this.init();
  }

  private init() {
    this.errorDisplay.style.color = "red";
    this.successDisplay.style.color = "green";

    this.tilesetImage.onload = () => {
      this.drawTileSelector();
      this.drawMap();
    };

    this.tilesetImage.onerror = () => {
      console.error("Failed to load tileset image");
    };

    this.mapCanvas.addEventListener("click", this.handleCanvasClick.bind(this));
    this.mapCanvas.addEventListener(
      "contextmenu",
      this.handleCanvasRightClick.bind(this)
    );

    this.prevLevelButton.addEventListener("click", this.prevLevel.bind(this));
    this.nextLevelButton.addEventListener("click", this.nextLevel.bind(this));
    this.saveButton.addEventListener("click", this.saveMap.bind(this));
  }

  private drawTileSelector() {
    this.tileSelector.innerHTML = "";
    const TILES: { [key: string]: string } = {
      BlackTile: "B",
      RedTile: "R",
      PurpleTile: "P",
      RockTile: "K",
      LavaTile: "L",
      BlueBlock: "T",
      Diamond: "D",
      RedDiamond: "RD",
      Dave: "DA",
      Fire: "F",
      Tentacles: "TE",
      Key: "Key",
      Water: "W",
      Trophy: "Y",
      Jetpack: "J",
      ExitDoor: "E",
    };

    Object.keys(TILES).forEach((key, index) => {
      const tileBox = document.createElement("div");
      tileBox.classList.add("tile-box");
      tileBox.dataset.tile = TILES[key];
      if (TILES[key] === this.currentTile) {
        tileBox.classList.add("selected");
      }

      let spriteX: number, spriteY: number;
      switch (key) {
        case "BlackTile":
          [spriteX, spriteY] = [0, 0];
          break;
        case "RedTile":
          [spriteX, spriteY] = [1, 0];
          break;
        case "PurpleTile":
          [spriteX, spriteY] = [2, 0];
          break;
        case "RockTile":
          [spriteX, spriteY] = [3, 0];
          break;
        case "LavaTile":
          [spriteX, spriteY] = [4, 0];
          break;
        case "BlueBlock":
          [spriteX, spriteY] = [5, 0];
          break;
        case "Diamond":
          [spriteX, spriteY] = [0, 1];
          break;
        case "RedDiamond":
          [spriteX, spriteY] = [1, 1];
          break;
        case "Dave":
          [spriteX, spriteY] = [0, 2];
          break;
        case "Fire":
          [spriteX, spriteY] = [0, 5];
          break;
        case "Tentacles":
          [spriteX, spriteY] = [0, 6];
          break;
        case "Key":
          [spriteX, spriteY] = [5, 1];
          break;
        case "Water":
          [spriteX, spriteY] = [0, 7];
          break;
        case "Trophy":
          [spriteX, spriteY] = [7, 1];
          break;
        case "Jetpack":
          [spriteX, spriteY] = [8, 1];
          break;
        case "ExitDoor":
          [spriteX, spriteY] = [1, 8];
          break;
        default:
          [spriteX, spriteY] = [0, 0];
          break;
      }

      const sprite = new SolidTile(
        spriteX,
        spriteY,
        index,
        0,
        TILE_SIZE,
        TILE_SIZE
      );

      const tileCanvas = document.createElement("canvas");
      tileCanvas.width = TILE_SIZE;
      tileCanvas.height = TILE_SIZE;
      const ctx = tileCanvas.getContext("2d")!;
      sprite.draw(ctx, 0, 0, TILE_SIZE, TILE_SIZE);

      tileBox.appendChild(tileCanvas);
      this.tileSelector.appendChild(tileBox);

      tileBox.addEventListener("click", () => {
        this.currentTile = tileBox.dataset.tile!;
        document
          .querySelectorAll(".tile-box")
          .forEach((box) => box.classList.remove("selected"));
        tileBox.classList.add("selected");
      });
    });
  }

  private getTileCoordinates(key: string): [number, number] {
    let coordinates: [number, number];
    switch (key) {
      case "B": // BlackTile
        coordinates = [0, 0];
        break;
      case "R": // RedTile
        coordinates = [1, 0];
        break;
      case "P": // PurpleTile
        coordinates = [2, 0];
        break;
      case "K": // RockTile
        coordinates = [3, 0];
        break;
      case "L": // LavaTile
        coordinates = [4, 0];
        break;
      case "T": // BlueBlock
        coordinates = [5, 0];
        break;
      case "D": // Diamond
        coordinates = [0, 1];
        break;
      case "RD": // RedDiamond
        coordinates = [1, 1];
        break;
      case "DA": // Dave
        coordinates = [0, 2];
        break;
      case "F": // Fire
        coordinates = [0, 5];
        break;
      case "TE": // Tentacles
        coordinates = [0, 6];
        break;
      case "W": // Water
        coordinates = [0, 7];
        break;
      case "Key": // Key
        coordinates = [5, 1];
        break;
      case "Y": // Trophy
        coordinates = [7, 1];
        break;
      case "J": // Jetpack
        coordinates = [8, 1];
        break;
      case "E": // ExitDoor
        coordinates = [1, 8];
        break;
      default:
        coordinates = [0, 0];
        break;
    }

    return coordinates;
  }

  public drawMap() {
    this.mapCtx.clearRect(0, 0, this.mapCanvas.width, this.mapCanvas.height);
    this.drawScoreArea();
    this.drawFooterArea();
    console.log("map length", this.map.length);
    for (let y = 0; y < this.map.length; y++) {
      for (let x = 0; x < this.map[y].length; x++) {
        if (this.map[y][x]) {
          this.drawTile(this.map[y][x]!, x * DRAW_SIZE, (y + 1) * DRAW_SIZE);
        }
      }
    }
  }

  drawScoreArea() {
    this.mapCtx.fillStyle = "gray";
    this.mapCtx.fillRect(0, 0, this.mapCanvas.width, DRAW_SIZE);
    this.mapCtx.fillStyle = "white";
    this.mapCtx.font = "bold 16px Arial";
    this.mapCtx.fillText(
      "SCORE AREA",
      this.mapCanvas.width / 2 - 60,
      DRAW_SIZE / 1.5
    );
  }

  drawFooterArea() {
    this.mapCtx.fillStyle = "gray";
    this.mapCtx.fillRect(
      0,
      this.mapCanvas.height - DRAW_SIZE,
      this.mapCanvas.width,
      DRAW_SIZE
    );
    this.mapCtx.fillStyle = "white";
    this.mapCtx.font = "bold 16px Arial";
    this.mapCtx.fillText(
      "GAME FOOTER AREA",
      this.mapCanvas.width / 2 - 80,
      this.mapCanvas.height - DRAW_SIZE / 1.5
    );
  }

  drawTile(tile: string, x: number, y: number) {
    if (tile !== " ") {
      const [spriteX, spriteY] = this.getTileCoordinates(tile);

      const sprite = new SolidTile(spriteX, spriteY, TILE_SIZE, TILE_SIZE);

      sprite.draw(this.mapCtx, x, y, DRAW_SIZE, DRAW_SIZE);
    }
  }

  handleCanvasClick(e: MouseEvent) {
    const rect = this.mapCanvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / DRAW_SIZE);
    const y = Math.floor((e.clientY - rect.top) / DRAW_SIZE) - 1;

    if (y >= 0 && y < this.map.length) {
      this.map[y][x] = this.currentTile;
      this.drawMap();
    }
  }

  handleCanvasRightClick(e: MouseEvent) {
    e.preventDefault();
    const rect = this.mapCanvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / DRAW_SIZE);
    const y = Math.floor((e.clientY - rect.top) / DRAW_SIZE) - 1;

    if (y >= 0 && y < this.map.length) {
      this.map[y][x] = null;
      this.drawMap();
    }
  }

  saveMap() {
    const daveCount = this.map.flat().filter((tile) => tile === "DA").length;
    const trophyCount = this.map.flat().filter((tile) => tile === "Y").length;

    let errorMessages: string[] = [];
    this.errorDisplay.innerText = "";
    this.successDisplay.innerText = "";
    if (daveCount === 0) {
      errorMessages.push("At least one Dave must be placed on the map.");
    }
    if (daveCount > 1) {
      errorMessages.push("Only one Dave can be placed on the map.");
    }
    if (trophyCount === 0) {
      errorMessages.push("At least one Trophy must be placed on the map.");
    }
    if (trophyCount > 1) {
      errorMessages.push("Only one Trophy can be placed on the map.");
    }

    if (errorMessages.length === 0) {
      this.output.value = JSON.stringify(
        this.map.map((row) => row.map((tile) => (tile ? tile : null)))
      );
      this.successDisplay.innerText = "Map saved successfully.";
      this.levels[this.currentLevelIndex] = this.map;
      console.log("levels", this.levels);
      this.drawGameCanvas();
    } else {
      errorMessages.forEach((msg) => {
        const errorMessage = document.createElement("p");
        errorMessage.innerText = msg;
        this.errorDisplay.appendChild(errorMessage);
      });
    }
  }

  prevLevel() {
    console.log("currentIndex", this.currentLevelIndex);
    console.log("i am clicked left");
    if (this.currentLevelIndex > 0) {
      this.currentLevelIndex--;
      this.map = this.levels[this.currentLevelIndex];
      this.drawMap();
    } else {
      this.currentLevelIndex = 0;
    }
  }

  nextLevel() {
    console.log("i am clicked right");
    console.log("levels length", this.levels.length);
    if (this.currentLevelIndex < this.levels.length - 1) {
      this.currentLevelIndex++;
      console.log("index", this.currentLevelIndex);
      this.map = this.levels[this.currentLevelIndex];
      console.log("drawingmap", this.map);
      console.log("current Index", this.currentLevelIndex);
      this.drawMap();
    } else {
      console.log("Already at the last level");
    }
  }

  drawGameCanvas() {
    new Game(this.levels);
  }
}

let editorInstance: CustomEditorLevel | null = null;

document.addEventListener("DOMContentLoaded", () => {
  editorInstance = new CustomEditorLevel();
});

export const editor = editorInstance;

// this function is called from the splash screen section
export function startEditor() {
  document.getElementById("splashScreen")!.style.display = "none";
  document.getElementById("editor")!.style.display = "flex";
  if (editorInstance) {
    editorInstance.drawMap();
  }
}
