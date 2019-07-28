import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import * as IsMobile from 'is-mobile';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import * as StackBlur from 'stackblur-canvas';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.sass']
})
export class MainComponent implements OnInit, AfterViewInit {

  images = [
    '../../assets/iv.jpg',
    '../../assets/anytime.jpg',
    '../../assets/III.jpg',
    '../../assets/cucumber01.png',
    '../../assets/FYH.jpg',
    '../../assets/II.jpg',
    '../../assets/pgp.gif',
    '../../assets/mom02.png',
    '../../assets/pese01.png',
    '../../assets/time01.png',
    '../../assets/synthetic.png',
    '../../assets/sorcerer.png',
    '../../assets/tib.png',
  ];

  @ViewChild('carousel', {static: false})
  private _container: ElementRef<HTMLElement>;

  public selectedItem = 0;
  public itemSize: number;
  public itemSizeStyle: string;

  public tops: number[] = [];
  public translate: number[] = [];
  public scales: number[] = [];
  public center: number;
  public carouselHeight: number;
  public grow = 3;
  public shadowCenters: number[] = [];
  public transforms: SafeStyle[] = [];

  public scrollPaddingTop: string;
  public scrollPaddingBottom: string;

  public margins: string[] = [];

  constructor(
    private _changeDetector: ChangeDetectorRef,
    private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.itemSize = IsMobile.isMobile(navigator.userAgent) ? 75 : 100;
    this.itemSizeStyle = `${this.itemSize}px`;
    this.tops = new Array(this.images.length);
    this.transforms = new Array(this.images.length);
  }

  ngAfterViewInit() {
    this.center = 250;

    this.margins = new Array(this.images.length);
    this.margins[0] = `${this.center - this.itemSize / 2}px 0 0 0`;
    this.margins[this.images.length - 1] = `0 0 ${this._container.nativeElement.clientHeight - this.center - this.itemSize / 2}px 0`;

    this.scrollPaddingTop = `${this.center - this.itemSize / 2}px`;
    this.scrollPaddingBottom = `${this._container.nativeElement.clientHeight - this.center - this.itemSize / 2}px`;

    this.updateLayout();

    this.helper();
    this._changeDetector.detectChanges();
  }

  private updateLayout() {
    for (let i = 0; i < this.images.length; i++) {
      this.translate[i] = this.center + i * this.itemSize;
      this.tops[i] = this.translate[i] - i * this.itemSize;
    }
  }

  setSelected(i: number) {
    this._container.nativeElement.scrollTo(0, i * this.itemSize);
  }

  getTransform(top: number, scale: number): SafeStyle {
    const transform = `translateY(${top}px) scale(${scale})`;
    return this.sanitizer.bypassSecurityTrustStyle(transform);
  }


  helper() {

    this.shadowCenters = new Array(this.images.length);
    for (let i = 0; i < this.images.length; i++) {
      this.shadowCenters[i] = this.center + i * this.itemSize - this._container.nativeElement.scrollTop;
    }

    const distances: number[] = new Array(this.images.length);
    const centerTransformed = this._container.nativeElement.scrollTop + this.center;
    for (let i = 0; i < this.images.length; i++) {
      distances[i] = Math.abs(centerTransformed - (this.center + i * this.itemSize));
    }

    const p = (this._container.nativeElement.scrollTop % this.itemSize) / this.itemSize;

    const heights: number[] = new Array(this.images.length);
    heights.fill(this.itemSize);

    for (let i = 0; i < this.images.length; i++) {
      const k = Math.min(1, distances[i] / (this.itemSize * 2));

      const scale = 1 + (this.grow - 1) * (1 + Math.cos(k * Math.PI)) / 2;
      this.scales[i] = scale;
      heights[i] = this.itemSize * scale;
    }

    const a = Math.floor(this._container.nativeElement.scrollTop / this.itemSize);
    const b = a + 1;

    // this.selectedItem = p < 0.5 ? a : b;
    // this.selectedItem = Math.min(this.selectedItem, this.images.length - 1);

    const dist = (heights[a] + heights[b]) / 2 - this.itemSize;
    this.translate[a] = - p * dist;
    this.translate[b] = (1 - p) * dist;

    let current = this.translate[a] - (heights[a] - this.itemSize) / 2;
    for (let i = a - 1; i >= 0; i--) {
      current -= (heights[i] - this.itemSize) / 2;
      this.translate[i] = current;
      current -= (heights[i] - this.itemSize) / 2;
    }

    current = this.translate[b] + (heights[b] - this.itemSize) / 2;
    for (let i = b + 1; i < this.images.length; i++) {
      current += (heights[i] - this.itemSize) / 2;
      this.translate[i] = current;
      current += (heights[i] - this.itemSize) / 2;
    }

    for (let i = 0; i < this.images.length; i++) {
      // this.tops[i] = this.translate[i] - this.itemSize / 2;
      this.transforms[i] = this.getTransform(this.translate[i], this.scales[i]);
    }

    // window.clearTimeout(this.isScrollingTimeout);
    // this.isScrollingTimeout = window.setTimeout(
    //   () => this._container.nativeElement.scrollTo({top: this.selectedItem * this.itemSize, behavior: 'auto'}), 500);

  }

  hello(e) {
    console.log(e)
  }


}
