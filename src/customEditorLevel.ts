import { SolidTile } from "./SolidTile";
import { LEVEL1_MAP } from "./levels";
import { startGame } from "./game";

export function initializeMapEditor() {
  const TILE_SIZE = 64;
  const DRAW_SIZE = 50;
  const TILES: { [key: string]: string } = {
    BlackTile: "B", // 0,0
    RedTile: "R", // 1,0
    PurpleTile: "P", // 2,0
    RockTile: "K", // 3,0
    LavaTile: "L", // 4,0
    BlueBlock: "T", // 5,0
    Diamond: "D", // 0,1
    RedDiamond: "RD", // 1,1
    Dave: "DA", // 0,2 - Dave's sprite
    Gun: "G", // 3,1
    Ring: "RNG", // 4,1
    Key: "Key", // 5,1
    Crown: "C", // 6,1
    Trophy: "Y", // 7,1
    Jetpack: "J", // 8,1
    ExitDoor: "E", // 1,8
  };

  let currentTile = "B";
  const mapCanvas = document.getElementById("map") as HTMLCanvasElement;
  const mapCtx = mapCanvas.getContext("2d")!;
  const tileSelector = document.getElementById("tileSelector") as HTMLElement;
  const saveButton = document.getElementById("save") as HTMLButtonElement;
  const output = document.createElement("textarea");
  const errorDisplay = document.createElement("div");
  errorDisplay.style.color = "red";
  errorDisplay.id = "errorDisplay";
  document.getElementById("editor")!.appendChild(errorDisplay);

  const successDisplay = document.createElement("div");
  successDisplay.style.color = "green";
  successDisplay.id = "successDisplay";
  document.getElementById("editor")!.appendChild(successDisplay);

  let map: (string | null)[][] = LEVEL1_MAP.map((row) =>
    row.map((tile) => (tile === " " ? null : tile))
  );

  // Loading the tileset image
  const tilesetImage = new Image();
  tilesetImage.src = "assets/sprites/tileset.png";

  tilesetImage.onload = function () {
    console.log("Tileset image loaded");
    drawTileSelector();
    drawMap();
  };

  tilesetImage.onerror = function () {
    console.error("Failed to load tileset image");
  };

  function drawTileSelector() {
    tileSelector.innerHTML = "";
    Object.keys(TILES).forEach((key) => {
      const tileBox = document.createElement("div");
      tileBox.classList.add("tile-box");
      tileBox.dataset.tile = TILES[key];
      if (TILES[key] === currentTile) {
        tileBox.classList.add("selected");
      }
      let x: number, y: number;
      switch (key) {
        case "BlackTile":
          [x, y] = [0, 0];
          break;
        case "RedTile":
          [x, y] = [1, 0];
          break;
        case "PurpleTile":
          [x, y] = [2, 0];
          break;
        case "RockTile":
          [x, y] = [3, 0];
          break;
        case "LavaTile":
          [x, y] = [4, 0];
          break;
        case "BlueBlock":
          [x, y] = [5, 0];
          break;
        case "Diamond":
          [x, y] = [0, 1];
          break;
        case "RedDiamond":
          [x, y] = [1, 1];
          break;
        case "Dave":
          [x, y] = [0, 2];
          break;
        case "Gun":
          [x, y] = [3, 1];
          break;
        case "Ring":
          [x, y] = [4, 1];
          break;
        case "Key":
          [x, y] = [5, 1];
          break;
        case "Crown":
          [x, y] = [6, 1];
          break;
        case "Trophy":
          [x, y] = [7, 1];
          break;
        case "Jetpack":
          [x, y] = [8, 1];
          break;
        case "ExitDoor":
          [x, y] = [1, 8];
          break;
        default:
          [x, y] = [0, 0];
          break;
      }
      const sprite = new SolidTile(x, y, 0, 0);
      const tileCanvas = document.createElement("canvas");
      tileCanvas.width = TILE_SIZE;
      tileCanvas.height = TILE_SIZE;
      const ctx = tileCanvas.getContext("2d")!;
      sprite.draw(ctx, 0, 0);
      tileBox.appendChild(tileCanvas);
      tileSelector.appendChild(tileBox);

      tileBox.addEventListener("click", () => {
        currentTile = tileBox.dataset.tile!;
        document
          .querySelectorAll(".tile-box")
          .forEach((box) => box.classList.remove("selected"));
        tileBox.classList.add("selected");
      });
    });
  }

  function drawMap() {
    mapCtx.clearRect(0, 0, mapCanvas.width, mapCanvas.height);
    drawScoreArea();
    drawFooterArea();
    for (let y = 0; y < map.length; y++) {
      for (let x = 0; x < map[y].length; x++) {
        if (map[y][x]) {
          // Offset by one row for score area
          drawTile(map[y][x]!, x * DRAW_SIZE, (y + 1) * DRAW_SIZE);
        }
      }
    }
  }

  function drawScoreArea() {
    mapCtx.fillStyle = "gray";
    mapCtx.fillRect(0, 0, mapCanvas.width, DRAW_SIZE);
    mapCtx.fillStyle = "white";
    mapCtx.font = "bold 16px Arial";
    mapCtx.fillText("SCORE AREA", mapCanvas.width / 2 - 60, DRAW_SIZE / 1.5);
  }

  function drawFooterArea() {
    mapCtx.fillStyle = "gray";
    mapCtx.fillRect(
      0,
      mapCanvas.height - DRAW_SIZE,
      mapCanvas.width,
      DRAW_SIZE
    );
    mapCtx.fillStyle = "white";
    mapCtx.font = "bold 16px Arial";
    mapCtx.fillText(
      "GAME FOOTER AREA",
      mapCanvas.width / 2 - 80,
      mapCanvas.height - DRAW_SIZE / 1.5
    );
  }

  function drawTile(tile: string, x: number, y: number) {
    if (tile !== " ") {
      let spriteX: number, spriteY: number;
      switch (tile) {
        case "B":
          [spriteX, spriteY] = [0, 0];
          break;
        case "R":
          [spriteX, spriteY] = [1, 0];
          break;
        case "P":
          [spriteX, spriteY] = [2, 0];
          break;
        case "K":
          [spriteX, spriteY] = [3, 0];
          break; // Rock tile
        case "L":
          [spriteX, spriteY] = [4, 0];
          break;
        case "T":
          [spriteX, spriteY] = [5, 0];
          break;
        case "D":
          [spriteX, spriteY] = [0, 1];
          break;
        case "RD":
          [spriteX, spriteY] = [1, 1];
          break;
        case "DA":
          [spriteX, spriteY] = [0, 2];
          break; // Dave's sprite
        case "G":
          [spriteX, spriteY] = [3, 1];
          break;
        case "RNG":
          [spriteX, spriteY] = [4, 1];
          break;
        case "Key":
          [spriteX, spriteY] = [5, 1];
          break; // Key tile
        case "C":
          [spriteX, spriteY] = [6, 1];
          break;
        case "Y":
          [spriteX, spriteY] = [7, 1];
          break;
        case "J":
          [spriteX, spriteY] = [8, 1];
          break;
        case "E":
          [spriteX, spriteY] = [1, 8];
          break;
        default:
          [spriteX, spriteY] = [0, 0];
          break;
      }
      const sprite = new SolidTile(spriteX, spriteY, TILE_SIZE, TILE_SIZE);
      sprite.draw(mapCtx, x, y, DRAW_SIZE, DRAW_SIZE);
    }
  }

  mapCanvas.addEventListener("click", (e) => {
    const rect = mapCanvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / DRAW_SIZE);
    const y = Math.floor((e.clientY - rect.top) / DRAW_SIZE) - 1;

    if (y >= 0 && y < map.length) {
      map[y][x] = currentTile;
      console.log("Placed tile:", currentTile, "at", x, y);
      drawMap();
    }
  });

  mapCanvas.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    const rect = mapCanvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / DRAW_SIZE);
    const y = Math.floor((e.clientY - rect.top) / DRAW_SIZE) - 1;

    if (y >= 0 && y < map.length) {
      map[y][x] = null;
      console.log("Removed tile at", x, y);
      drawMap();
    }
  });

  saveButton.addEventListener("click", () => {
    const daveCount = map.flat().filter((tile) => tile === "DA").length;
    const trophyCount = map.flat().filter((tile) => tile === "Y").length;

    let errorMessages: string[] = [];
    errorDisplay.innerText = "";
    successDisplay.innerText = "";
    console.log(`DaveCount: ${daveCount}`);
    console.log(`TrophyCount: ${trophyCount}`);
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
      map.unshift(Array(map[0].length).fill("B"));
      map.push(Array(map[0].length).fill("B"));
      output.value = JSON.stringify(
        map.map((row) => row.map((tile) => (tile ? tile : null)))
      );
      console.log("Map saved:", output.value);
      successDisplay.innerText = "Map saved successfully.";
      // After saving, clear and redraw the game canvas
      drawGameCanvas();
    } else {
      errorDisplay.innerText = "";
      errorMessages.forEach((msg) => {
        const errorMessage = document.createElement("p");
        errorMessage.innerText = msg;
        errorDisplay.appendChild(errorMessage);
      });
    }
  });

  function drawGameCanvas() {
    const gameCanvas = document.getElementById(
      "gameCanvas"
    ) as HTMLCanvasElement;
    const gameCtx = gameCanvas.getContext("2d")!;
    gameCtx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
    for (let y = 0; y < map.length; y++) {
      for (let x = 0; x < map[y].length; x++) {
        if (map[y][x]) {
          drawTile(map[y][x]!, x * DRAW_SIZE, y * DRAW_SIZE);
        }
      }
    }
    document.getElementById("editor")!.style.display = "none";
    document.getElementById("gameCanvas")!.style.display = "block";
    startGame(map); // Start the game with the saved map
  }

  document.getElementById("editor")!.style.display = "block";
  document.getElementById("splashScreen")!.style.display = "none";
  drawTileSelector();
  drawMap();
}
