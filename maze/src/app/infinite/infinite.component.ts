import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {InfiniteCanvas} from "../InfiniteCanvas";

@Component({
  selector: 'app-infinite',
  templateUrl: './infinite.component.html',
  styleUrls: ['./infinite.component.less']
})
export class InfiniteComponent implements OnInit, AfterViewInit {
  @ViewChild('myCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  constructor() { }

  ngAfterViewInit(): void {


    // setTimeout(() => {
    //   console.log('sss njj');
    //   window.addEventListener('gesturestart', function (e) {
    //     console.log('sss');
    //     e.preventDefault();
    //   });
    // }, 3000)

    window.addEventListener('touchstart', (event) => {
      console.log('Gesture changed:', event);
    });

    this.canvasRef.nativeElement.addEventListener('touchend', (event) => {
      console.log('xxaa', event)
    });

    this.canvasRef.nativeElement.addEventListener('touchend', (event) => {
      console.log('xxaa', event)
    });

    this.canvasRef.nativeElement.addEventListener('touchstart', (event) => {
      console.log('touchstart', event)
    });

    this.canvasRef.nativeElement.addEventListener('gestureend', (event) => {
      console.log('Gesture ended:', event);
    });
  //   this.canvasRef.nativeElement.addEventListener('wheel', (e) => {
  //     console.log('whell', e.clientX, e.clientY);
  //   // e.preventDefault();
  //   // 检查是否按下了 Alt 键
  //   const isAltPressed = e.altKey;
  //   // 检查是否按下了 Command 键（Meta 键）
  //   const isCommandPressed = e.metaKey;
  //   const delta = Math.sign(e.deltaY);
  //     if (delta > 0) {
  //       this.infiniteCanvas.zoom(0.995);
  //     } else {
  //       this.infiniteCanvas.zoom(1.005);
  //     }
  //   if (isAltPressed || isCommandPressed) {
  //     // 在按下 Alt 键的情况下执行缩放操作
  //
  //   } else {
  //     // 在未按下 Alt 键的情况下执行默认操作（防止浏览器默认滚动行为）
  //     //e.preventDefault();
  //   }
  // });

  }

  ngOnInit(): void {

    this.infiniteCanvas = new InfiniteCanvas(30);
  }

  infiniteCanvas:any;


}
