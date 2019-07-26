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
    this.center = 250;
    this.top = this.center - this.size[1] / 2;

    const topFill = this.top;

    console.log(`clientHeight: ${this._container.nativeElement.clientHeight} center: ${this.center} min: ${this.size[0]}`);
    const bottomFill = (this._container.nativeElement.clientHeight - this.center);

    this.carouselHeight = topFill + this.images.length * this.size[0] + bottomFill;
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
    return this.sanitizer.bypassSecurityTrustStyle(transform);
  }

  helper() {

    const distances: number[] = new Array(this.images.length);
    const centerTransformed = this._container.nativeElement.scrollTop + this.center;
    for (let i = 0; i < this.images.length; i++) {
      distances[i] = Math.abs(centerTransformed - (this.center + i * this.size[0]));
    }

    const p = (this._container.nativeElement.scrollTop % this.size[0]) / this.size[0];

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
  }
}
