import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfiguracionComponent } from './configuracion.component';
import { ConfiguracionRoutingModule } from './configuracion-routing.module';
import { SharedModule } from '../shared/shared.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [ConfiguracionComponent],
  imports: [
    CommonModule,FormsModule, NgxPaginationModule,
    ReactiveFormsModule, SharedModule, ConfiguracionRoutingModule,
  ]
})
export class ConfiguracionModule { }
