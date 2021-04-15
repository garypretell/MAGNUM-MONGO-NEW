import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { FamilysearchComponent } from './familysearch.component';
import { FamilySearchRoutingModule } from './familysearch-routing.module';
import { TreeviewModule } from 'ngx-treeview';
import { AngularSplitModule } from 'angular-split';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgImageSliderModule } from 'ng-image-slider';
import { DragulaModule } from 'ng2-dragula';
import { IndexingComponent } from './indexing/indexing.component';
import { EvaluatingComponent } from './evaluating/evaluating.component';
import { CompleteComponent } from './complete/complete.component';
import { Safe } from './pipe/safe.pipe';

@NgModule({
  declarations: [FamilysearchComponent, IndexingComponent, EvaluatingComponent, CompleteComponent, Safe],
  imports: [
    CommonModule,
    FormsModule, ReactiveFormsModule, FilterPipeModule, AngularSplitModule, DragulaModule, NgxPaginationModule,
    FamilySearchRoutingModule, NgxChartsModule, TreeviewModule, NgImageSliderModule
  ]
})
export class FamilysearchModule { }
