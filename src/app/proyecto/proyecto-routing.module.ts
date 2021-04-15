import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { DocumentoComponent } from "./documento/documento.component";
import { PlantillaComponent } from "./documento/plantilla/plantilla.component";
import { MidocumentoComponent } from "./midocumento/midocumento.component";
import { ListadoComponent } from "./midocumento/milibro/listado/listado.component";
import { MilibroComponent } from "./midocumento/milibro/milibro.component";
import { DetalleComponent } from "./midocumento/milibro/detalle/detalle.component";
import { ListaComponent } from "./midocumento/milibro/detalle/lista/lista.component";
import { MiplantillaComponent } from "./midocumento/miplantilla/miplantilla.component";
import { ProyectoComponent } from "./proyecto.component";
import { MibusquedaComponent } from "./midocumento/mibusqueda/mibusqueda.component";

const routes: Routes = [
  {
    path: "",
    children: [
      { path: "", component: ProyectoComponent, pathMatch: "full" },
      {
        path: ":p",
        children: [
          { path: "", component: DocumentoComponent, pathMatch: "full" },
          {
            path: "midocumento",
            component: MidocumentoComponent,
            pathMatch: "full",
          },
          {
            path: ":d",
            children: [
              { path: "", component: PlantillaComponent, pathMatch: "full" },
              {
                path: "miplantilla",
                component: MiplantillaComponent,
                pathMatch: "full"
              },
              {
                path: "mibusqueda",
                component: MibusquedaComponent,
                pathMatch: "full",
              },
              {
                path: "milibro",
                children: [
                  { path: "", component: MilibroComponent, pathMatch: "full" },
                  {
                    path: ":l",
                    children: [
                      {
                        path: "",
                        component: DetalleComponent,
                        pathMatch: "full",
                      },
                      {
                        path: "lista",
                        component: ListaComponent,
                        pathMatch: "full",
                      },
                    ],
                  },
                ],
              },
              {
                path: "listado",
                component: ListadoComponent,
                pathMatch: "full",
              },
            ],
          },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProyectoRoutingModule {}
