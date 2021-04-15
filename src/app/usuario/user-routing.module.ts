import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsuarioComponent } from '../usuario/usuario.component';
import { UserDetailComponent } from '../usuario/user-detail/user-detail.component';
import { UserReportComponent } from '../usuario/user-report/user-report.component';


const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', component: UsuarioComponent, pathMatch: 'full' },
      {
        path: ':u',
        children: [
          { path: '', component: UserDetailComponent, pathMatch: 'full' },
          { path: 'report', component: UserReportComponent },
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
