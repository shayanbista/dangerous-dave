import { SolidTile } from "./SolidTile";
// import { Tile } from "./tile";
import { Character } from "./character";
import { EdibleTile } from "./edibleTIle";

import { TILE_SIZE } from "./constant";

let gameCanvas: HTMLCanvasElement;
let gameCtx: CanvasRenderingContext2D;
let map: (string | null)[][];
let dave: Character;

export const solidTiles: SolidTile[] = [];
export const edibleTiles: EdibleTile[] = [];

export function startGame(newMap: (string | null)[][]) {
  map = newMap;
  gameCanvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
  gameCtx = gameCanvas.getContext("2d")!;
  gameCanvas.style.backgroundColor = "black";

  initializeTiles(map);

  // Find Dave's starting position
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (map[y][x] === "DA") {
        dave = new Character(
          {
            getTile,
          },
          x * TILE_SIZE,
          y * TILE_SIZE
        );

        break;
      }
    }
  }

  renderGame();

  window.requestAnimationFrame(gameLoop);
}

function renderTiles() {
  for (const tile of solidTiles) {
    tile.draw(gameCtx, tile.x, tile.y, TILE_SIZE, TILE_SIZE);
  }
  for (const tile of edibleTiles) {
    tile.draw(gameCtx, tile.x, tile.y, TILE_SIZE, TILE_SIZE);
  }
}

function initializeTiles(map: (string | null)[][]) {
  // Clear previous tiles
  solidTiles.length = 0;
  edibleTiles.length = 0;

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
            type = "pickabl";
            break;
          case "RD":
            [spriteX, spriteY] = [1, 1];
            type = "pickable";
            break;
          case "G":
            [spriteX, spriteY] = [3, 1];
            type = "pickable";
            break;
          case "RNG":
            [spriteX, spriteY] = [4, 1];
            type = "pickable";
            break;
          case "Key":
            [spriteX, spriteY] = [5, 1];
            type = "pickable";
            break;
          case "C":
            [spriteX, spriteY] = [6, 1];
            type = "pickable";
            break;
          case "Y":
            [spriteX, spriteY] = [7, 1];
            type = "pickable";
            break;
          case "J":
            [spriteX, spriteY] = [8, 1];
            type = "pickable";
            break;
          case "E":
            [spriteX, spriteY] = [1, 8];
            type = "pickable";
            break;
          default:
            [spriteX, spriteY] = [0, 0];
            type = "pickable";
            break;
        }

        const sprite =
          type === "solid"
            ? new SolidTile(
                spriteX,
                spriteY,
                x * TILE_SIZE,
                y * TILE_SIZE,
                64,
                64
              )
            : new EdibleTile(
                spriteX,
                spriteY,
                x * TILE_SIZE,
                y * TILE_SIZE,
                64,
                64
              );

        if (type === "solid") {
          solidTiles.push(sprite as SolidTile);
        }

        if (type === "pickable") {
          edibleTiles.push(sprite as EdibleTile);
        }
      }
    }
  }
}

function renderGame() {
  gameCtx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
  renderTiles();
  renderDave(dave.posX, dave.posY);
}

function renderTile(tile: string, x: number, y: number) {
  let spriteX: number, spriteY: number;
  let type: String;
  switch (tile) {
    case "B":
      [spriteX, spriteY] = [0, 0];
      [type] = "solid";
      break;
    case "R":
      [spriteX, spriteY] = [1, 0];
      [type] = "solid";
      break;
    case "P":
      [spriteX, spriteY] = [2, 0];
      [type] = "solid";
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
      type = "solid";
      break;
    case "RD":
      [spriteX, spriteY] = [1, 1];
      type = "pickable";
      break;
    case "DA": {
      if (dave.direction === 1) {
        spriteX = (dave.animationFrame % 4) + 1;
        spriteY = 2;
      } else {
        spriteX = (dave.animationFrame % 4) + 5;
        spriteY = 2;
      }
      type = "dave";
      break;
    }
    case "G":
      [spriteX, spriteY] = [3, 1];
      type = "pickable";
      break;
    case "RNG":
      [spriteX, spriteY] = [4, 1];
      type = "pickable";
      break;
    case "Key":
      [spriteX, spriteY] = [5, 1];
      type = "pickable";
      break;
    case "C":
      [spriteX, spriteY] = [6, 1];
      type = "pickable";
      break;
    case "Y":
      [spriteX, spriteY] = [7, 1];
      type = "pickable";
      break;
    case "J":
      [spriteX, spriteY] = [8, 1];
      type = "pickable";
      break;
    case "E":
      [spriteX, spriteY] = [1, 8];
      type = "pickable";
      break;
    default:
      [spriteX, spriteY] = [0, 0];
      type = "pickable";
      break;
  }

  const sprite =
    type === "solid"
      ? new SolidTile(spriteX, spriteY, x, y, 64, 64)
      : new EdibleTile(spriteX, spriteY, x, y, 64, 64);
  sprite.draw(gameCtx, x, y, TILE_SIZE, TILE_SIZE);

  if (type === "solid") {
    solidTiles.push(sprite as SolidTile);
  }

  edibleTiles.push(sprite as EdibleTile);

  console.log("solid tile length", solidTiles.length);
  console.log(edibleTiles.length);
}

function renderDave(posX: number, posY: number) {
  let spriteX = 2;
  let spriteY = 2;

  if (dave.direction === 1) {
    spriteX = (dave.animationFrame % 4) + 1;
  } else {
    spriteX = (dave.animationFrame % 4) + 5;
  }

  dave.draw(gameCtx, posX, posY, TILE_SIZE, TILE_SIZE);

  // gameCtx.drawImage(
  //   getTileImage("DA"),
  //   spriteX * TILE_SIZE,
  //   spriteY * TILE_SIZE,
  //   TILE_SIZE,
  //   TILE_SIZE,
  //   dave.posX,
  //   dave.posY,
  //   TILE_SIZE,
  //   TILE_SIZE
  // );
}

function gameLoop() {
  dave.update();
  renderGame();
  window.requestAnimationFrame(gameLoop);
}

function getTile(x: number, y: number) {
  const col = Math.floor(x / TILE_SIZE);
  const row = Math.floor(y / TILE_SIZE);
  return map[row] && map[row][col];
}
