import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CaptureComponent } from './capture.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { CaptureRoutingModule } from './capture-routing.component';
import { DragScrollModule } from 'ngx-drag-scroll';
import { ImageCropperModule } from 'ngx-image-cropper';
import {NgxPaginationModule} from 'ngx-pagination';
import { FolderComponent } from './folder/folder.component';
import { SafePipe } from './pipe/Safe.pipe';
import { CropComponent } from './crop/crop.component';


@NgModule({
  declarations: [CaptureComponent, FolderComponent, SafePipe, CropComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    FilterPipeModule,
    CaptureRoutingModule,
    NgxChartsModule,
    ImageCropperModule,
    // NgImageSliderModule,
    // DragulaModule,
    // AngularCropperjsModule,
    DragScrollModule
  ]
})
export class CaptureModule { }
