import { Component, OnInit, Input, AfterViewInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import * as StackBlur from 'stackblur-canvas';
import { CarouselChild } from '../carousechild';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-parallax',
  templateUrl: './parallax.component.html',
  styleUrls: ['./parallax.component.sass'],
  animations: [
    trigger('spin', [
      state('true, void', style({
        transform: 'translate(-50%, -50%) rotate({{ begin }}) '
      }), { params: { begin: '213deg'}}),
      state('false', style({
        transform: 'translate(-50%, -50%) rotate({{ end }})'
      }), { params: { end: '213deg' }}),
      transition('* => *', [
        animate('{{ duration }} ease-in-out')
      ], { params: { duration: '10s'}}),
    ]),
    trigger('zoom', [
      state('true', style({
        transform: 'translate(-50%, -50%) scale(1.2) '
      })),
      state('false, void', style({
        transform: 'translate(-50%, -50%) scale(1)'
      })),
      transition('* => *', [
        animate('20s ease-in-out')
      ]),
    ])
  ]
})
export class ParallaxComponent implements OnInit, CarouselChild, AfterViewInit {

  public rotate1;
  public rotate2 = true;
  public zoom = true;

  public angle1 = 45;
  public angle2 = -63;
  public scale1 = 3;
  public scale2 = 3;
  private _previousT: number;

  @Input()
  public height = 100;

  @ViewChild('blurred1', {static: false})
  private _blurred1: ElementRef<HTMLCanvasElement>;

  @ViewChild('blurred2', {static: false})
  private _blurred2: ElementRef<HTMLCanvasElement>;

  @ViewChild('theimage', {static: false})
  private _theimage: ElementRef<HTMLImageElement>;

  @Input()
  public image = '';

  public get top(): number {
    return this._host.nativeElement.getBoundingClientRect().top;
  }

  constructor(
    private _host: ElementRef<HTMLElement>,
    private _changeDetection: ChangeDetectorRef,
    private sanitizer: DomSanitizer) { }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    requestAnimationFrame((frameT) => this.animate(frameT));
  }

  private animate(t: number) {

    if (this._previousT) {
      const elapsed = t - this._previousT;
      this.angle1 += 5.5 * elapsed / 1000;
      this.angle2 += -8.2 * elapsed / 1000;
      this.scale1 = Math.sin(elapsed / 10000) + 2;
      // console.log(this.scale1);
    }
    this._previousT = t;
    requestAnimationFrame((frameT) => this.animate(frameT));
  }

  public blurAll() {
    this.blur(this._theimage.nativeElement, this._blurred1.nativeElement, 7);
    // this.blur(this._theimage.nativeElement, this._blurred2.nativeElement, 3);
  }

  getTransform(angle: number, scale: number) {
    const transform = `translate(-50%, -50%) scale(${scale}) rotate(${angle}deg)`;
    return this.sanitizer.bypassSecurityTrustStyle(transform);
  }


  blur(img: HTMLImageElement, canvas: HTMLCanvasElement, radius: number) {
    const w = 512;
    const h = 512;

    canvas.width = w;
    canvas.height = h;

    const context = canvas.getContext('2d');
    context.drawImage( img, 0, 0, w, h);
    StackBlur.canvasRGBA( canvas, 0, 0, w, h, radius);
    const imageData = context.getImageData(0, 0, w, h);

    for (let i = 0; i < imageData.data.length; i += 4) {
      const k = Math.max(imageData.data[i], imageData.data[i + 1], imageData.data[i + 2]);
      imageData.data[i + 3] = k;
    }

    context.putImageData(imageData, 0, 0);
  }

  restartRotate1() {
    this.rotate1 = !this.rotate1;
    this._changeDetection.detectChanges();
  }

  restartRotate2() {
    this.rotate2 = !this.rotate2;
    this._changeDetection.detectChanges();
  }

  restartZoom() {
    this.zoom = !this.zoom;
    this._changeDetection.detectChanges();
  }
}
