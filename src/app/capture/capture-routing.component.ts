import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { CaptureComponent } from './capture.component';
import { FolderComponent } from './folder/folder.component';
import { CropComponent } from './crop/crop.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', component: CaptureComponent, pathMatch: 'full' },
      {
        path: ':f',
        children: [
          { path: '', component: FolderComponent, pathMatch: 'full' },
          { path: 'crop', component: CropComponent },
        ]
      }
    ]
  }
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CaptureRoutingModule {}
