import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NubeComponent } from './nube.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NubeRoutingModule } from './nube-routing.module';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { AngularSplitModule } from 'angular-split';
import { NgxPaginationModule } from 'ngx-pagination';


@NgModule({
  declarations: [NubeComponent],
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule, NubeRoutingModule, FilterPipeModule, AngularSplitModule, NgxPaginationModule
  ]
})
export class NubeModule { }
