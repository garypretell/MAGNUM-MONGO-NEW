import {  Component,  OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, Subject, of } from 'rxjs';
import { HomeService } from './core/services/home/home.service';
import { RecordService } from './core/services/record/record.service';
import { ProyectoService } from './core/services/proyecto/proyecto.service';
import { ElectronService } from './core/services';
import Swal from "sweetalert2";
import { map, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: 'app-header.component.html',
  styleUrls: ['./app-header.component.scss']
})
export class AppHeaderComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject();
  @ViewChild('myModal') myModal: ElementRef;
  elementos: any[] = [];
  currentChoice: string;
  name: any;
  codigo: any;
  message;
  mensaje: any;
  transferencia: any;
  super: boolean;
  sede: any;
  misede: any;
  miproyecto: any;
  foto: any;
  documentos$: Observable<any>;
  directorio$: Observable<any>;
  user;
  contador: any;
  proyecto: any;
  public valorEmitido = this.recordService.recibir;
  public valorEmitidoP = this.proyectoService.recibir;
  constructor(
    public auth: HomeService,
    public recordService: RecordService,
    public router: Router,
    public route: ActivatedRoute,
    public proyectoService: ProyectoService,
    private electronService: ElectronService,
  ) {

    this.super = true;
  }


  async ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user'));
    this.auth.user$ = of(JSON.parse(localStorage.getItem('user')));
    this.contador = await this.recordService.countRecords();
    this.recordService.enviar(this.contador);
    this.valorEmitidoP.pipe(map(p => {
      this.proyecto = p;
    }), takeUntil(this.unsubscribe$)).subscribe();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  goAreas() {
    this.router.navigate(['/area']);
  }

  goProyectos() {
    this.router.navigate(['/proyecto']);
  }

  signOut() {
    localStorage.removeItem("user");
    localStorage.clear();
    this.user = null;
    this.auth.user$ = null;
    this.auth.authenticated$ = of(false);
    this.router.navigate(['/']);

  }

  limpiar() {

  }


  async goDocumento() {

  }

  async goUsuarios() {
    this.router.navigate(['/user']);
  }

  listado() {
    // jQuery(this.myModal.nativeElement).modal('show');
  }

  goReporte() { 
    this.router.navigate(['/user', this.user.uid, 'report' ]);
  }

  goAvatar() {
    this.router.navigate(['/user', this.user.uid ]);
  }

  async exportData(): Promise<any> {
    this.valorEmitidoP.pipe(map(p => {
      this.proyecto = p;
    }), takeUntil(this.unsubscribe$)).subscribe();
    try {
      const exec = require("child_process").exec;
      const command = `mongoexport --host localhost --port 27017 --db sindex -c records --query "{\\"proyectoid\\": \\"${this.proyecto._id.toString()}\\"}" --type json --out M://Configuracion/proyecto_${this.proyecto.codigo}.json`;
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

  importData(): any {
    this.valorEmitidoP.pipe(map(p => {
      this.proyecto = p;
    }), takeUntil(this.unsubscribe$)).subscribe();
    if (!this.electronService.fs.existsSync(`M://Configuracion/proyecto_${this.proyecto.codigo}.json`)) {
      Swal.fire({
        icon: 'info',
        title: 'Advertencia',
        text: 'No se encuentra el archivo requerido',
      });
      return;
    } else {
      const fecha = Date.now();
      const exec = require("child_process").exec;
      const command = `mongoimport -d sindex -c records --file M://Configuracion/proyecto_${this.proyecto.codigo}.json`;
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
        fs.rename(`M://Configuracion/proyecto_${this.proyecto.codigo}.json`, `M://Configuracion/proyecto_${this.proyecto.codigo}_${fecha}.json`, function (err) {
          if (err) console.log("ERROR: " + err);
        });
      });
    }
  }


}
