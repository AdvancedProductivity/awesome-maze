import {AfterViewInit, Component, OnInit} from '@angular/core';
import {PrimGenerator} from "../api";
import {fr_BE} from "ng-zorro-antd/i18n";
import {HeartArr} from "./heart";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-html-for',
  templateUrl: './html-for.component.html',
  styleUrls: ['./html-for.component.less']
})
export class HtmlForComponent implements OnInit ,AfterViewInit{
  grid: number[][] = HeartArr;
  cellSize: number = 20; // 默认每个格子的大小
  finished = false;
  funRunning = false;
  running = false;
  delay= 20;
  collision = 0;
  mazeSize = 40;
  walks = 0;
  connectCollection = false;
  str0 = ''
  str1 = ''
  randomRuned = false;
  instance: any = {};
  editorOptions = { theme: 'vs-light', language: 'javascript' };

  ngAfterViewInit(): void {
  }

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const query = params['q'];
      this.connectCollection = query.indexOf('__') > -1;
      const vs = query.split('__');
      this.str0 = vs[0];
      this.str1 = vs[1];
    });
    this.finished = false;
    this.running = false;
    this.delay= 20;
    this.collision = 0;
    this.walks = 0;
    this.robotPosition = { x: 1, y: 1, isInWall: 'blue', direction: 'east' }; // Initial position

    (window as any).toMap = () => {
      return this.grid;
    }
    this.grid[this.grid.length-2][this.grid[this.grid.length-2].length-2] = 5
    this.randomRun()
  }


  getBackgroundColor(value: number): string {
    switch(value) {
      case 1:
        return 'rgb(245, 245, 245)';
      case 5:
        return 'rgb(89, 245, 245)';
      case 2:
        return 'orange';
      default:
        return 'rgb(100, 100, 100)';
    }
  }

  robotPosition = { x: 1, y: 1, isInWall: 'blue', direction: 'east' }; // Initial position
  code: string =
    `
function getDirection(x, y, instance, lookUp, haveBeen, steps) {
    console.log('x is', x);
    console.log('y is', y);
    console.log('instance is', instance);
    console.log('step is', steps);
    console.log('west is wall?', lookUp('west'));
    console.log('was east have been there ', haveBeen('west'));
    return 'north';
}
`;

  lookUpWall(direction: string): boolean {
    switch (direction) {
      case 'north':
        return this.grid[this.robotPosition.y - 1][this.robotPosition.x] === 3;
      case 'east':
        return this.grid[this.robotPosition.y][this.robotPosition.x + 1] === 3;
      case 'south':
        return this.grid[this.robotPosition.y + 1][this.robotPosition.x] === 3;
      case 'west':
        return this.grid[this.robotPosition.y][this.robotPosition.x - 1] === 3;
      default:
        return false;
    }
  }

  checkVisited(direction: string): boolean {
    switch (direction) {
      case 'north':
        return this.grid[this.robotPosition.y - 1][this.robotPosition.x] === 5;
      case 'east':
        return this.grid[this.robotPosition.y][this.robotPosition.x + 1] === 5;
      case 'south':
        return this.grid[this.robotPosition.y + 1][this.robotPosition.x] === 5;
      case 'west':
        return this.grid[this.robotPosition.y][this.robotPosition.x - 1] === 5;
      default:
        return false;
    }
  }

  haveBeen(direction: string): boolean {
    switch (direction) {
      case 'north':
        return this.grid[this.robotPosition.y - 1][this.robotPosition.x] === 2;
      case 'east':
        return this.grid[this.robotPosition.y][this.robotPosition.x + 1] === 2;
      case 'south':
        return this.grid[this.robotPosition.y + 1][this.robotPosition.x] === 2;
      case 'west':
        return this.grid[this.robotPosition.y][this.robotPosition.x - 1] === 2;
      default:
        return false;
    }
  }

  moveRobot2(randomDirection: string): void {
    if (randomDirection !== 'north' && randomDirection !== 'east' && randomDirection !== 'south' && randomDirection !== 'west') {
      this.connectCollection = false;
      this.str1 = '';
      this.str0 = '🤡 Invalid direction! only support north, east, south, west 🤡'
      return;
    }
    if (!this.running && !this.funRunning) {
      return;
    }
    if (this.finished) {
      return;
    }
    this.walks++;
    this.robotPosition.direction = randomDirection;

    if (this.lookUpWall(randomDirection)) {
      this.robotPosition.isInWall = 'red';
    } else {
      this.robotPosition.isInWall = 'blue';

      switch (randomDirection) {
        case 'north':
          this.robotPosition.y--;
          break;
        case 'east':
          this.robotPosition.x++;
          break;
        case 'south':
          this.robotPosition.y++;
          break;
        case 'west':
          this.robotPosition.x--;
          break;
      }

      if (this.checkVisited(randomDirection)) {
        this.robotPosition.isInWall = 'green';
      }
    }

    if ('green' === this.robotPosition.isInWall) {
      this.finished = true;
      this.running = false;
      this.funRunning = false;
      this.connectCollection = false;
      this.str1 = '';
      this.str0 = '🎉🎉🎉Congratulations! Robot reached the end! 🎉'
    } else if ('red' === this.robotPosition.isInWall) {
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
      if (this.randomRuned) {
        this.randomRun();
      }else {
        this.funRuned();
      }
    }, this.delay); // Adjust the interval as needed
  }

  isRobotPosition(row: number, col: number): boolean {
    // 判断当前格子是否是机器人的位置
    return this.robotPosition.x === col && this.robotPosition.y === row;
  }

  restart() {
    this.ngOnInit();
    const generator = new PrimGenerator(this.mazeSize);
    const maze = generator.generateMaze();
    this.grid = maze.getCells();
  }

  handleFunction() {
    if (!this.funRunning) {
      this.instance = {};
      this.funRunning = true;
      this.funRuned();
    }else {
      this.funRunning = false;
    }
  }

  run() {
    this.running = !this.running;
    if (this.running) {
      this.randomRun();
    }
  }

  randomRun() {
    this.randomRuned = true;
    const directions = ['north', 'east', 'south', 'west'];
    const randomDirection = directions[Math.floor(Math.random() * 4)];
    this.moveRobot2(randomDirection);
  }

  rev(i: number, j: number) {
    if (this.grid[i][j] == 3) {
      this.grid[i][j] = 1;
    }else {
      this.grid[i][j] = 3;
    }
  }

  private funRuned() {
    this.randomRuned = false;
    const userFunctionCode = this.code;
    let userFunction;
    try {
      userFunction = new Function('x', 'y','instance', 'lookUp', 'haveBeen', 'steps', userFunctionCode + '\nreturn getDirection(x, y, instance, lookUp, haveBeen, steps);');
    } catch (error) {
      this.connectCollection = false;
      this.str1 = '';
      this.str0 = '🤡 Invalid function! 🤡'
      console.error(this.str0, error);
      this.funRunning = false;
      return;
    }

    try {
      const result = userFunction(this.robotPosition.x, this.robotPosition.y,
        this.instance, this.lookUpWall.bind(this), this.haveBeen.bind(this), this.walks);
      this.moveRobot2(result);
    } catch (error) {
      this.connectCollection = false;
      this.str1 = '';
      this.str0 = '🤡 executed error function! 🤡'
      this.funRunning = false;
      console.error(this.str0, error);
    }

  }
}
