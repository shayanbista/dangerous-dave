import { Character } from "./Classes/Character";
import { Enemy } from "./Classes/Enemy";

/** -1 for left direction  1 for right direction*/
export type Direction = -1 | 1;

export interface Rect {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

/**
 * The function `isColliding` determines if two rectangles are colliding based on their positions.
 * @param {Rect} rect1 - Rect object representing the first rectangle with properties left, right, top,
 * and bottom.
 * @param {Rect} rect2 - Rect object representing the second rectangle with properties left, right,
 * top, and bottom.
 * @returns a boolean value indicating whether the two rectangles, rect1 and rect2, are colliding or
 * overlapping.
 */
export function isColliding(rect1: Rect, rect2: Rect): boolean {
  return rect1.left < rect2.right && rect1.right > rect2.left && rect1.top < rect2.bottom && rect1.bottom > rect2.top;
}

/**
 * The function calculates the distance between an enemy and a player using their positions.
 * @param {Enemy} enemy - An object representing an enemy character in a game. It likely contains
 * properties such as posX and posY representing the enemy's position on the game map.
 * @param {Character} player - The `player` parameter represents the character controlled by the player
 * in the game. It likely contains information such as the player's position (posX, posY) on the game
 * map.
 * @returns the Euclidean distance between the enemy and the player character based on their positions
 * in 2D space.
 */
export function distance(enemy: Enemy, player: Character) {
  return Math.sqrt(Math.pow(enemy.posX - player.posX, 2) + Math.pow(enemy.posY - player.posY, 2));
}

/**
 * The function `combineMaps` takes multiple arrays of strings and combines them row by row into a new
 * 2D array.
 * @param {string[][][]} maps - The `maps` parameter in the `combineMaps` function is an array of
 * arrays of strings. Each inner array represents a map, where each element in the inner array is a row
 * of the map. The function combines these maps by concatenating the rows from each map into a new
 * combined map.
 * @returns The function `combineMaps` returns a two-dimensional array of strings, which represents the
 * combined maps from the input arrays of string arrays.
 */
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
