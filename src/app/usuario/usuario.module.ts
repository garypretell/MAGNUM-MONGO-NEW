import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioComponent } from './usuario.component';
import { UserReportComponent } from './user-report/user-report.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { UserRoutingModule } from './user-routing.module';



@NgModule({
  declarations: [UsuarioComponent, UserReportComponent, UserDetailComponent],
  imports: [
    CommonModule,
    FormsModule, ReactiveFormsModule, FilterPipeModule,
    UserRoutingModule, NgxChartsModule
  ]
})
export class UsuarioModule { }
