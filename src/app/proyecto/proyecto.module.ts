import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProyectoComponent } from './proyecto.component';
import { ProyectoRoutingModule } from './proyecto-routing.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { DragulaModule } from 'ng2-dragula';
import { AngularSplitModule } from 'angular-split';
import { NgxSpinnerModule } from "ngx-spinner";
import { DocumentoComponent } from './documento/documento.component';
import { PlantillaComponent } from './documento/plantilla/plantilla.component';
import { MidocumentoComponent } from './midocumento/midocumento.component';
import { MiplantillaComponent } from './midocumento/miplantilla/miplantilla.component';
import { MilibroComponent } from './midocumento/milibro/milibro.component';
import { ListadoComponent } from './midocumento/milibro/listado/listado.component';
import { DetalleComponent } from './midocumento/milibro/detalle/detalle.component';
import { ListaComponent } from './midocumento/milibro/detalle/lista/lista.component';
import { MibusquedaComponent } from './midocumento/mibusqueda/mibusqueda.component';

@NgModule({
  declarations: [ProyectoComponent, DocumentoComponent, PlantillaComponent, MidocumentoComponent, MiplantillaComponent, MilibroComponent, ListadoComponent, DetalleComponent, ListaComponent, MibusquedaComponent],
  imports: [
    SharedModule, ProyectoRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule, NgxPaginationModule, DragulaModule, FilterPipeModule, AngularSplitModule, NgxSpinnerModule
  ]
})
export class ProyectoModule { }
