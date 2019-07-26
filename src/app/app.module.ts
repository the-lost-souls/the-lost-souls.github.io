import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { MainComponent } from './main/main.component';
import { ParallaxComponent } from './parallax/parallax.component';
import { CarouselFillerComponent } from './carousel-filler/carousel-filler.component';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    ParallaxComponent,
    CarouselFillerComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
