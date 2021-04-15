import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { AppHeaderComponent } from './app-header.component';
import { CommonModule } from '@angular/common';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { DragulaModule } from 'ng2-dragula';
import { AngularSplitModule } from 'angular-split';
import {NgxPaginationModule} from 'ngx-pagination';
import { NgxSpinnerModule } from "ngx-spinner";
import { DragScrollModule } from 'ngx-drag-scroll';
import { ImageCropperModule } from 'ngx-image-cropper';
import { NgImageSliderModule } from 'ng-image-slider';
import { OrderDownlineTreeviewEventParser, TreeviewConfig, TreeviewEventParser, TreeviewModule } from 'ngx-treeview';



@NgModule({
  declarations: [AppComponent, AppHeaderComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    CoreModule,
    SharedModule,
    AppRoutingModule,
    NgxChartsModule,
    FilterPipeModule,
    NgxPaginationModule,
    NgxSpinnerModule,
    DragScrollModule,
    NgImageSliderModule,
    ImageCropperModule,
    DragulaModule.forRoot(),
    AngularSplitModule,
    TreeviewModule.forRoot()

  ],
  providers: [ { provide: TreeviewEventParser, useClass: OrderDownlineTreeviewEventParser }],
  bootstrap: [AppComponent]
})
export class AppModule {}
