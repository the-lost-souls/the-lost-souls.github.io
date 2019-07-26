import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarouselFillerComponent } from './carousel-filler.component';

describe('CarouselFillerComponent', () => {
  let component: CarouselFillerComponent;
  let fixture: ComponentFixture<CarouselFillerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarouselFillerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarouselFillerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
