import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './shared/components';
import { RequireUnauthGuard, EditorGuard } from './home/guards';

const routes: Routes = [
  {
    path: '',
    loadChildren: './home/home.module#HomeModule',
    canActivate: [RequireUnauthGuard]
  },
  {
    path: 'detail',
    loadChildren: './detail/detail.module#DetailModule'
  },
  {
    path: 'proyecto',
    loadChildren: './proyecto/proyecto.module#ProyectoModule'
  },
  {
    path: 'familysearch/:p',
    loadChildren:  './familysearch/familysearch.module#FamilysearchModule',
  },
  {
    path: 'capture',
    loadChildren:  './capture/capture.module#CaptureModule',
  },
  {
    path: 'user',
    loadChildren:  './usuario/usuario.module#UsuarioModule',
  },
  {
    path: '**',
    component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
   ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
