import {AfterViewInit, Component, OnInit} from '@angular/core';
import {PrimGenerator} from "../api";

// TriangleManager.ts
class TriangleManager {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private x1: number;
  private y1: number;
  private x2: number;
  private y2: number;
  private x3: number;
  private y3: number;
  private color: string;

  constructor(canvasId: string) {
    this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d')!;
    this.x1 = 0;
    this.y1 = 0;
    this.x2 = 0;
    this.y2 = 0;
    this.x3 = 0;
    this.y3 = 0;
    this.color = 'red';
  }

  private calculateVertices(x: number, y: number, offset: number, direction: string): void {
    switch (direction) {
      case 'east':
        this.x1 = x;
        this.y1 = y;
        this.x2 = x;
        this.y2 = y + offset;
        this.x3 = x + offset;
        this.y3 = y + (offset / 2);
        break;
      // 可以根据需要添加其他方向的计算逻辑
      default:
        break;
    }
  }

  init(x: number, y: number, offset: number, direction: string, color: string): void {
    this.color = color;
    this.calculateVertices(x, y, offset, direction);
    this.draw();
  }

  private draw(): void {
    const ctx = this.ctx;

    // 清除之前的内容
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // 开始绘制新的三角形
    ctx.beginPath();
    ctx.moveTo(this.x1, this.y1);
    ctx.lineTo(this.x2, this.y2);
    ctx.lineTo(this.x3, this.y3);
    ctx.closePath();

    // 填充三角形
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  update(x: number, y: number, offset: number, direction: string, color: string): void {
    this.color = color;
    this.calculateVertices(x, y, offset, direction);
    this.draw(); // 重新绘制更新后的三角形
  }
}

@Component({
  selector: 'app-html-for',
  templateUrl: './html-for.component.html',
  styleUrls: ['./html-for.component.less']
})
export class HtmlForComponent implements OnInit ,AfterViewInit{
  grid: number[][] = [];
  cellSize: number = 20; // 默认每个格子的大小
  constructor() { }
  finished = false;
  delay= 20;
  collision = 0;
  walks = 0;

  ngAfterViewInit(): void {

// 使用示例：
    const triangleManager = new TriangleManager('myCanvas'); // 创建 TriangleManager 实例
    triangleManager.init(1, 1, 20, 'east', 'blue'); // 初始化一个三角形
// 等等需要更新时：
//     setTimeout(() => {
//       triangleManager.update(100, 100, 30, 'east', 'green'); // 更新三角形的位置和颜色
//     }, 2000); // 示例：2秒后更新
  }

  ngOnInit(): void {

    const generator = new PrimGenerator();
    const maze = generator.generateMaze();
    this.grid = maze.getCells();
    (window as any).toMap = () => {
      return this.grid;
    }
    this.grid[this.grid.length-1][this.grid.length-1] = 5
    this.moveRobot();
  }


  getBackgroundColor(value: number): string {
    switch(value) {
      case 1:
        return 'rgb(245, 245, 245)';
      case 2:
        return 'rgb(180, 180, 180)';
      default:
        return 'rgb(100, 100, 100)';
    }
  }

  robotPosition = { x: 1, y: 1, isInWall: 'blue', direction: 'east' }; // Initial position

  moveRobot(): void {
    if (this.finished) {
      return;
    }
    this.walks++;
    const directions = ['north', 'east', 'south', 'west'];
    const randomDirection = directions[Math.floor(Math.random() * 4)];
    console.log('direction:', randomDirection)
    this.robotPosition.direction = randomDirection;

    switch (randomDirection) {
      case 'north':
        if (this.grid[this.robotPosition.y - 1][this.robotPosition.x] !== 3) {
          this.robotPosition.y--;
          this.robotPosition.isInWall = 'blue';
        }else if (this.grid[this.robotPosition.y - 1][this.robotPosition.x] == 5){
          this.robotPosition.isInWall = 'green';
        }else {
          this.robotPosition.isInWall = 'red';
        }
        break;
      case 'east':
        if (this.grid[this.robotPosition.y][this.robotPosition.x + 1] !== 3) {
          this.robotPosition.x++;
          this.robotPosition.isInWall = 'blue';
        }else if (this.grid[this.robotPosition.y][this.robotPosition.x + 1] == 5){
          this.robotPosition.isInWall = 'green';
        }else {
          this.robotPosition.isInWall = 'red';
        }
        break;
      case 'south':
        if (this.grid[this.robotPosition.y + 1][this.robotPosition.x] !== 3) {
          this.robotPosition.y++;
          this.robotPosition.isInWall = 'blue';
        }else if (this.grid[this.robotPosition.y+1][this.robotPosition.x] == 5){
          this.robotPosition.isInWall = 'green';
        }else {
          this.robotPosition.isInWall = 'red';
        }
        break;
      case 'west':
        if (this.grid[this.robotPosition.y][this.robotPosition.x - 1] !== 3) {
          this.robotPosition.x--;
          this.robotPosition.isInWall = 'blue';
        }else if (this.grid[this.robotPosition.y][this.robotPosition.x- 1] == 5){
          this.robotPosition.isInWall = 'green';
        }else {
          this.robotPosition.isInWall = 'red';
        }
        break;
    }

    if ('green' === this.robotPosition.isInWall) {
      this.finished = true;
    }else if ('red' === this.robotPosition.isInWall) {
      this.collision++;
    }
    // Check collision
    if (this.grid[this.robotPosition.y][this.robotPosition.x] === 3) {
      // Collision with wall, change color
      console.log('Robot collided with wall!');
    }

    // Update maze
    this.grid[this.robotPosition.y][this.robotPosition.x] = 2;

    // Repeat movement
    setTimeout(() => {
      this.moveRobot();
    }, this.delay); // Adjust the interval as needed
  }

  isRobotPosition(row: number, col: number): boolean {
    // 判断当前格子是否是机器人的位置
    return this.robotPosition.x === col && this.robotPosition.y === row;
  }

  getTriangleStyles(): any {
    // 根据机器人的方向返回三角形的样式
    // 这里假设机器人朝右移动
    return {
      left: `${this.robotPosition.x * this.cellSize}px`,
      top: `${this.robotPosition.y * this.cellSize}px`,
      transform: 'rotate(270deg)' // 调整三角形的方向，这里假设朝右
    };
  }


}
