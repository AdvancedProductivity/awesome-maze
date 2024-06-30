export class Point {
  constructor(public x: number, public y: number) {}
}

export enum CellType {
  IN = 1,
  FRONTIER,
  OUT
}

export enum Direction {
  NORTH = 10,
  EAST,
  SOUTH,
  WEST
}

export class Maze {
  private cells: number[][];

  constructor(public width: number, public height: number) {
    this.cells = Array.from({ length: height }, () => Array(width).fill(CellType.OUT));
  }

  setCellType(x: number, y: number, type: CellType): void {
    this.cells[y][x] = type;
  }

  setStart(x: number, y: number): void {
    this.cells[y][x] = CellType.IN; // or other specific type for start
  }

  setFinish(x: number, y: number): void {
    this.cells[y][x] = CellType.IN; // or other specific type for finish
  }

  getCellType(x: number, y: number): number {
    return this.cells[y][x];
  }

  getCells(): number[][] {
    return this.cells;
  }
}

export class PrimGenerator {
  private mazeWidth: number = 5;
  private mazeHeight: number = 5;
  private primGrid: CellType[][] = [];
  private frontierList: Point[] = [];

  constructor(size: number = 10) {
    this.mazeWidth = size;
    this.mazeHeight = size;
    // Initialize configuration panel or other setup if needed
  }

  generateMaze(): Maze {
    if (this.mazeWidth < 1 || this.mazeHeight < 1) {
      throw new Error("Maze too small");
    }

    const realWidth = (2 * this.mazeWidth) + 1;
    const realHeight = (2 * this.mazeHeight) + 1;

    const maze = new Maze(realWidth, realHeight);

    maze.setStart(1, 1);
    maze.setFinish(realWidth - 2, realHeight - 2);

    this.primGrid = Array.from({ length: realHeight }, () => Array(realWidth).fill(CellType.OUT));

    const originX = realWidth - 2;
    const originY = realHeight - 2;

    this.setPrimCellType(maze, originX, originY, CellType.IN);

    if (originX > 1) this.setPrimCellType(maze, originX - 2, originY, CellType.FRONTIER);
    if (originY > 1) this.setPrimCellType(maze, originX, originY - 2, CellType.FRONTIER);
    if (originX < realWidth - 2) this.setPrimCellType(maze, originX + 2, originY, CellType.FRONTIER);
    if (originY < realHeight - 2) this.setPrimCellType(maze, originX, originY + 2, CellType.FRONTIER);

    while (this.frontierList.length > 0) {
      const frontier = this.frontierList.splice(this.randomInt(this.frontierList.length), 1)[0];
      this.setPrimCellType(maze, frontier.x, frontier.y, CellType.IN);

      if (frontier.x > 1 && this.primGrid[frontier.y][frontier.x - 2] === CellType.OUT)
        this.setPrimCellType(maze, frontier.x - 2, frontier.y, CellType.FRONTIER);
      if (frontier.y > 1 && this.primGrid[frontier.y - 2][frontier.x] === CellType.OUT)
        this.setPrimCellType(maze, frontier.x, frontier.y - 2, CellType.FRONTIER);
      if (frontier.x < realWidth - 2 && this.primGrid[frontier.y][frontier.x + 2] === CellType.OUT)
        this.setPrimCellType(maze, frontier.x + 2, frontier.y, CellType.FRONTIER);
      if (frontier.y < realHeight - 2 && this.primGrid[frontier.y + 2][frontier.x] === CellType.OUT)
        this.setPrimCellType(maze, frontier.x, frontier.y + 2, CellType.FRONTIER);

      const directions: Direction[] = [];
      if (frontier.x - 2 > 0 && this.primGrid[frontier.y][frontier.x - 2] === CellType.IN)
        directions.push(Direction.WEST);
      if (frontier.y - 2 > 0 && this.primGrid[frontier.y - 2][frontier.x] === CellType.IN)
        directions.push(Direction.NORTH);
      if (frontier.x + 2 < realWidth && this.primGrid[frontier.y][frontier.x + 2] === CellType.IN)
        directions.push(Direction.EAST);
      if (frontier.y + 2 < realHeight && this.primGrid[frontier.y + 2][frontier.x] === CellType.IN)
        directions.push(Direction.SOUTH);

      if (directions.length > 0) {
        const path = directions[this.randomInt(directions.length)];
        switch (path) {
          case Direction.NORTH:
            this.setPrimCellType(maze, frontier.x, frontier.y - 1, CellType.IN);
            break;
          case Direction.EAST:
            this.setPrimCellType(maze, frontier.x + 1, frontier.y, CellType.IN);
            break;
          case Direction.SOUTH:
            this.setPrimCellType(maze, frontier.x, frontier.y + 1, CellType.IN);
            break;
          case Direction.WEST:
            this.setPrimCellType(maze, frontier.x - 1, frontier.y, CellType.IN);
            break;
        }
      }
    }

    return maze;
  }

  private randomInt(n: number): number {
    return Math.floor(Math.random() * n);
  }

  private setPrimCellType(maze: Maze, x: number, y: number, type: CellType): void {
    if (type === CellType.IN) {
      maze.setCellType(x, y, CellType.IN);
    } else if (type === CellType.FRONTIER) {
      this.frontierList.push(new Point(x, y));
    }
    this.primGrid[y][x] = type;
  }
}

