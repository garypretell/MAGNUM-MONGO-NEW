import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FamilysearchComponent } from './familysearch.component'
import { CompleteComponent } from './complete/complete.component';
import { EvaluatingComponent } from './evaluating/evaluating.component';
import { IndexingComponent } from './indexing/indexing.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', component: FamilysearchComponent, pathMatch: 'full' },
      {
        path: ':id',
        children: [
          { path: 'INDEXING',  component: IndexingComponent },
          { path: 'EVALUATING',  component: EvaluatingComponent },
          { path: 'COMPLETE',  component: CompleteComponent }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FamilySearchRoutingModule { }
