import { Character } from "./Classes/Character";
import { Enemy } from "./Classes/Enemy";
export interface Rect {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

export function isColliding(rect1: Rect, rect2: Rect): boolean {
  return rect1.left < rect2.right && rect1.right > rect2.left && rect1.top < rect2.bottom && rect1.bottom > rect2.top;
}

export function distance(enemy: Enemy, player: Character) {
  return Math.sqrt(Math.pow(enemy.posX - player.posX, 2) + Math.pow(enemy.posY - player.posY, 2));
}


export function combineMaps(...maps: string[][][]): string[][] {
  const combinedMap: string[][] = [];
  const numRows = maps[0].length;

  for (let row = 0; row < numRows; row++) {
    let combinedRow: string[] = [];
    for (let map of maps) {
      combinedRow = combinedRow.concat(map[row]);
    }
    combinedMap.push(combinedRow);
  }

  return combinedMap;
}
