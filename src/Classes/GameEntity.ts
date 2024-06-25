interface GameEntityProps {
  posX: number;
  posY: number;
  width: number;
  height: number;
}

export class GameEntity implements GameEntityProps {
  constructor({ posX, posY, width, height }: GameEntityProps) {
    this.posX = posX;
    this.posY = posY;
    this.width = width;
    this.height = height;
  }
  posX: number;
  posY: number;
  width: number;
  height: number;
}
