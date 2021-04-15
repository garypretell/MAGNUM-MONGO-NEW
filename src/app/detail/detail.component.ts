import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { of } from "rxjs";
import { HomeService } from "../core/services/home/home.service";
import { ElectronService } from "../core/services";
import Swal from "sweetalert2";
import { RecordService } from "../core/services/record/record.service";
import { UserService } from "../core/services/user/user.service";
import { ProyectoService } from "../core/services/proyecto/proyecto.service";
import { DocumentService } from "../core/services/document/document.service";

@Component({
  selector: "app-detail",
  templateUrl: "./detail.component.html",
  styleUrls: ["./detail.component.scss"],
})
export class DetailComponent implements OnInit {
  proyectos: any;
  documentos: any = [];
  miproyecto: any;
  miproyectoEmmit: any;
  view: any;
  searchDoc: any = { nombre: "" };
  user;
  data;
  constructor(
    public auth: HomeService,
    public router: Router,
    public recordService: RecordService,
    private electronService: ElectronService,
    public proyectoService: ProyectoService,
    public documentoService: DocumentService,
    public route: ActivatedRoute,
    public userService: UserService
  ) {
    this.view = [innerWidth / 1.4, innerHeight / 2.15];
  }

  async ngOnInit() {
    this.user = JSON.parse(localStorage.getItem("user"));
    this.proyectos = await this.proyectoService.loadmiProyecto();
    if (this.proyectos.length > 0) {
      this.miproyecto = this.proyectos[0];
      this.miproyectoEmmit = this.miproyecto;
      this.proyectoService.enviar(this.miproyectoEmmit);
      this.documentos = await this.documentoService.loadmiDocumentoProyecto(
        this.miproyecto._id.toString()
      );
      this.getBarChart();
    }
  }

  async seleccionarProyecto(item): Promise<any> {
    this.miproyecto = item;
    this.miproyectoEmmit = this.miproyecto;
    this.proyectoService.enviar(this.miproyectoEmmit);
    this.documentos = await this.documentoService.loadmiDocumentoProyecto(
      this.miproyecto._id.toString()
    );
    this.getBarChart();
  }

  onSelect(data) {
    // console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data) {
    // console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data) {
    // console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }

  onResize(event) {
    // this.view = [event.target.innerWidth / 1.4, event.target.innerHeigth / 2.3];
  }

  async getBarChart(): Promise<any> {
    this.data = await this.recordService.grafica(
      this.user.uid,
      this.miproyecto._id.toString()
    );
  }

  goDocumento(): any {
    this.router.navigate(["/proyecto",  this.miproyecto._id.toString(), "midocumento"]);
    // return this.router.navigate(["document"]);
  }

  goFs(): any {
    if (!this.electronService.fs.existsSync(`M:/Imagenes/${this.miproyecto.nombre}`)) {
      Swal.fire({
        icon: "info",
        title: "Message",
        text: "The necessary files for Indexing will be created!",
      });
      this.electronService.fs.mkdirSync(`M:/Imagenes/${this.miproyecto.nombre}`);
      return this.router.navigate(["/familysearch", this.miproyecto._id.toString()]);
    } else {
      return this.router.navigate(["/familysearch", this.miproyecto._id.toString()]);
    }
  }

  async exportData(p): Promise<any> {

    try {
      const exec = require("child_process").exec;
      const command = `mongoexport --host localhost --port 27017 --db sindex -c records --query "{\\"proyectoid\\": \\"${p._id.toString()}\\"}" --type json --out M://Configuracion/proyecto_${p.codigo}.json`;
      exec(command, (err) => {
        if (err) {
          console.log(err);
          return;
        }
        Swal.fire({
          icon: "success",
          title: "Exportar Data",
          text: "Los archivos han sido creados!",
        });
      });
    } catch (error) {
      console.log(error);
    }
  }

  importData(p): any {
    if (!this.electronService.fs.existsSync(`M://Configuracion/proyecto_${p.codigo}.json`)) {
      Swal.fire({
        icon: 'info',
        title: 'Advertencia',
        text: 'No se encuentra el archivo requerido',
      });
      return;
    } else {
      const fecha = Date.now();
      const exec = require("child_process").exec;
      const command = `mongoimport -d sindex -c records --file M://Configuracion/proyecto_${p.codigo}.json`;
      exec(command, (err, stdout, stderr) => {
        if (err) {
          console.log(err);
          return;
        }
        Swal.fire({
          icon: 'info',
          title: 'Mensaje',
          text: 'La base de datos ha sido actualizada!',
        });
        const fs = require("fs");
        fs.rename(`M://Configuracion/proyecto_${p.codigo}.json`, `M://Configuracion/proyecto_${p.codigo}_${fecha}.json`, function (err) {
          if (err) console.log("ERROR: " + err);
        });
      });
    }
  }


  goCamera(): any {
    if (!this.electronService.fs.existsSync('M:/Captura/MAGNUM-CAPTURE.exe')) {
      Swal.fire({
        icon: 'error',
        title: 'Mensaje',
        text: 'El programa no ha sido instalado!',
      });
      return;
    } else {
      const shell = require("electron").shell;
      shell.openExternal(
        `M:/Captura/MAGNUM-CAPTURE.exe`
      );
    }
  }
}
