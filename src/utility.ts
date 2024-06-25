export interface Rect {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

export function isColliding(rect1: Rect, rect2: Rect): boolean {
  return rect1.left < rect2.right && rect1.right > rect2.left && rect1.top < rect2.bottom && rect1.bottom > rect2.top;
}
