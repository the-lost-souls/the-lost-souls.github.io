import { Component, OnInit, AfterViewInit, ViewChildren, ViewChild, ElementRef, QueryList, HostListener, ChangeDetectorRef } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { ParallaxComponent } from '../parallax/parallax.component';
import * as IsMobile from 'is-mobile';
import { CarouselChild } from '../carousechild';
import { DomSanitizer } from '@angular/platform-browser';
import { Minimatch } from 'minimatch';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.sass']
})
export class MainComponent implements OnInit, AfterViewInit {

  images = [
    '../../assets/car.jpg',
    '../../assets/clown_fish.jpg',
    '../../assets/parrot.jpg',
    '../../assets/anytime.jpg',
    '../../assets/II.jpg',
    '../../assets/synthetic.png'
  ];

  @ViewChildren('child')
  private _kids: QueryList<CarouselChild>;

  @ViewChild('carousel', {static: false})
  private _carousel: ElementRef<HTMLElement>;

  @ViewChild('container', {static: false})
  private _container: ElementRef<HTMLElement>;

  public size: [number, number];
  // public zoomArea: number;

  public tops: number[] = [];
  public centers: number[] = [];
  public scales: number[] = [];
  public center: number;
  public carouselHeight: number;
  public grow = 2;

  public top = 0;

  constructor(
    private _host: ElementRef<HTMLElement>,
    private _changeDetector: ChangeDetectorRef,
    private sanitizer: DomSanitizer) { }

  ngOnInit() {
    const min = IsMobile.isMobile(navigator.userAgent) ? 75 : 50;
    const max = min * 2;

    this.size = [min, max];
    this.tops = new Array(this.images.length);
  }

  ngAfterViewInit() {
    this.center = 250; // this._host.nativeElement.clientHeight;
    this.top = this.center - this.size[1] / 2;

    const topFill = this.top;

    console.log(`clientHeight: ${this._container.nativeElement.clientHeight} center: ${this.center} min: ${this.size[0]}`);
    const bottomFill = (this._container.nativeElement.clientHeight - this.center);

    this.carouselHeight = topFill + this.images.length * this.size[0] + bottomFill;
    console.log(this.carouselHeight);
    this.updateLayout();
    this._changeDetector.detectChanges();

    this.helper();
  }

  private updateLayout() {
    for (let i = 0; i < this.images.length; i++) {
      this.centers[i] = this.center + i * this.size[0];
      this.tops[i] = this.centers[i] - i * this.size[0];
    }
  }

  setSelected(i: number) {



    this._container.nativeElement.scrollTo(0, i * this.size[0]);
  }

  getTransform(top: number, scale: number) {
    const transform = `translateY(${top}px) scale(${scale})`;
    // const transform = `translateY(${top}px)`;
    // console.log(transform);
    return this.sanitizer.bypassSecurityTrustStyle(transform);
  }

  helper() {
    console.log('scroll: ' + this._container.nativeElement.scrollTop);


    const distances: number[] = new Array(this.images.length);
    const centerTransformed = this._container.nativeElement.scrollTop + this.center;
    for (let i = 0; i < this.images.length; i++) {
      distances[i] = Math.abs(centerTransformed - (this.center + i * this.size[0]));
    }

    console.log(distances);

    const p = (this._container.nativeElement.scrollTop % this.size[0]) / this.size[0];
    
    console.log(p);

    const heights: number[] = new Array(this.images.length);
    heights.fill(this.size[0]);

    for (let i = 0; i < this.images.length; i++) {
      const k = Math.min(1, distances[i] / (this.size[0] * 3));

      const scale = 1 + this.grow * (1 + Math.cos(k * Math.PI)) / 2;
      this.scales[i] = scale;
      heights[i] = this.size[0] * scale;
    }

    const a = Math.floor(this._container.nativeElement.scrollTop / this.size[0]);
    const b = a + 1;

    const dist = (heights[a] + heights[b]) / 2;
    this.centers[a] = centerTransformed - p * dist;
    this.centers[b] = centerTransformed + (1 - p) * dist;


    let current = this.centers[a] - heights[a] / 2;
    for (let i = a - 1; i >= 0; i--) {
      this.centers[i] = current - heights[i] / 2;
      current -= heights[i];
    }

    current = this.centers[b] + heights[b] / 2;
    for (let i = b + 1; i < this.images.length; i++) {
      this.centers[i] = current + heights[i] / 2;
      current += heights[i];
    }

    for (let i = 0; i < this.images.length; i++) {
      this.tops[i] = this.centers[i] - this.size[0] / 2;
    }

    // let current = this.center;
    // const height = this.size[0] * scale;
    // if (i === 0) {
    //   this.centers[i] = current;
    //   current += height / 2;
    // } else {
    //   this.centers[i] = current + height / 2;
    //   current += height;
    // }

    // this.tops[i] = this.centers[i] - this.size[0] / 2;


    // console.log(this.scales)





    //    const linearIndex = Math.floor((this.top + this._container.nativeElement.scrollTop + this.size[0] / 2) / this.size[0]);
    // const k = ((this._container.nativeElement.scrollTop) % this.size[0]) / this.size[0];
    // console.log(`fake: ${fakeFocus} real: ${realFocus} k: ${k}`);


    // console.log(`linear: ${linearIndex}`);
  }

  // @HostListener('window:scroll', [])
  updateZoom() {

    // console.log('scrollTop: ' + this._carousel.nativeElement.scrollTop);

    const min = this.size[0];
    const max = this.size[1];

    const growth = this.size[1] - this.size[0];

    const linearIndex = Math.floor((this.center + this._carousel.nativeElement.scrollTop) / min);
    const actualIndex = Math.max(0, linearIndex - 2);

    const heights: number[] = new Array(this._kids.length);
    heights.fill(min);

    this.scales = new Array(this._kids.length);
    this.scales.fill(1);

    this._kids.forEach(i => i.height = min);

    const kids = this._kids.toArray();

    const k = ((this._carousel.nativeElement.scrollTop) % min) / min;
    console.log(`linear: ${linearIndex} actual: ${actualIndex} k: ${k}`);


    // const k0 = 
    // const k1 = min + (1 - k) * 0.5 * growth;
    // const k2 = 1.5 * min + (1 - k) * 0.5 * growth;
    // const k3 = 1.5 * min + k * 0.5 * growth;
    // const k4 = min + k * 0.5 * growth;

    // if (i > )

    // console.log('k: ' + k);


    // const top = 0;



    // for (let i = 0; i < this._kids.length; i++) {

    //   const p = kids[i];
    //   if (p.top <= (top - min)) {
    //     continue;
    //   }

    //   // const k = (top - p.top) / min;
    //   const k1 = min + (1 - k) * 0.5 * growth;
    //   const k2 = 1.5 * min + (1 - k) * 0.5 * growth;
    //   const k3 = 1.5 * min + k * 0.5 * growth;
    //   const k4 = min + k * 0.5 * growth;

    //   heights[i + 1] = k1;
    //   heights[i + 2] = k2;
    //   heights[i + 3] = k3;
    //   heights[i + 4] = k4;
    //   this.scales[i + 1] = k1 / min;
    //   this.scales[i + 2] = k2 / min;
    //   this.scales[i + 3] = k3 / min;
    //   this.scales[i + 4] = k4 / min;
    //   // if (i + 1 < kids.length) {
    //   //   kids[i + 1].height = k1;
    //   // }
    //   // if (i + 2 < kids.length) {
    //   //   kids[i + 2].height = k2;
    //   // }
    //   // if (i + 3 < kids.length) {
    //   //   kids[i + 3].height = k3;
    //   // }
    //   // if (i + 4 < kids.length) {
    //   //   kids[i + 4].height = k4;
    //   // }
    //   break;
    // }

    let current = 0;
    for (let i = 0; i < this._kids.length; i++) {
      this.tops[i] = current;
      current += heights[i];
    }
    this._changeDetector.detectChanges();
  }
}
