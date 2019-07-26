import { Component, OnInit, ElementRef } from '@angular/core';
import { CarouselChild } from '../carousechild';

@Component({
  selector: 'app-carousel-filler',
  templateUrl: './carousel-filler.component.html',
  styleUrls: ['./carousel-filler.component.sass']
})
export class CarouselFillerComponent implements OnInit, CarouselChild {

  public get top(): number {
    return this._host.nativeElement.getBoundingClientRect().top;
  }

  public height = 100;

  constructor(private _host: ElementRef<HTMLElement>, ) { }

  ngOnInit() {
  }

}
