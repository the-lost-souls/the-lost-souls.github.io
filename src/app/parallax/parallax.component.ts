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
      state('true', style({
        transform: 'translate(-50%, -50%) scale(3.5) rotate({{ begin }}) '
      }), { params: { begin: '213deg'}}),
      state('false, void', style({
        transform: 'translate(-50%, -50%) scale(3) rotate({{ end }})'
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
export class ParallaxComponent implements OnInit, CarouselChild {

  public rotate1 = true;
  public rotate2 = true;
  public zoom = true;

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

  public blurAll() {
    this.blur(this._theimage.nativeElement, this._blurred1.nativeElement);
    this.blur(this._theimage.nativeElement, this._blurred2.nativeElement);
  }

  blur(img: HTMLImageElement, canvas: HTMLCanvasElement) {
    const w = 512;
    const h = 512;

    canvas.width = w;
    canvas.height = h;

    const context = canvas.getContext('2d');
    context.clearRect( 0, 0, w, h );
    context.drawImage( img, 0, 0, w, h);

    StackBlur.canvasRGB( canvas, 0, 0, w, h, 5);
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
