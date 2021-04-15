import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { map } from "rxjs/operators";
import { DocumentService } from "../../core/services/document/document.service";
import Swal from "sweetalert2";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ProyectoService } from "../../core/services/proyecto/proyecto.service";
import { HomeService } from "../../core/services/home/home.service";
const ObjectID = require("mongodb").ObjectID;
declare const jQuery: any;
declare const $;
@Component({
  selector: 'app-midocumento',
  templateUrl: './midocumento.component.html',
  styleUrls: ['./midocumento.component.scss']
})
export class MidocumentoComponent implements OnInit, OnDestroy {
  @ViewChild("inputEl") inputEl: ElementRef;
  @ViewChild("myModal") myModal: ElementRef;
  public addDocumentoForm: FormGroup;
  p =1;
  user: any;
  proyecto: any;
  documentos: any;
  proyId: any;
  constructor(
    public auth: HomeService,
    public formBuilder: FormBuilder,
    public activatedroute: ActivatedRoute,
    public documentoService: DocumentService,
    public proyectoService: ProyectoService,
    public router: Router
  ) {
    this.addDocumentoForm = this.formBuilder.group({
      nombre: ["", [Validators.required]],
    });
  }

  sub;
  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem("user"));
    this.sub = this.activatedroute.paramMap
      .pipe(
        map(async (params) => {
          this.proyId = new ObjectID(params.get("p"));
          this.proyecto = await this.proyectoService.findProyecto(this.proyId);
          this.documentos = await this.documentoService.loadmiDocumentoProyecto(
            this.proyId.toString()
          );
        })
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  addModal(): any {
    jQuery(this.myModal.nativeElement).modal("show");
    setTimeout(() => this.inputEl.nativeElement.focus(), 500);
  }

  async addDocumento(): Promise<any> {
    const documento: any = {
      codigo: this.addDocumentoForm.value.nombre.replace(/ /g, ""),
      nombre: this.addDocumentoForm.value.nombre,
      name: this.addDocumentoForm.value.nombre,
      Libros: 0,
      principal: false,
      proyecto: this.proyId.toString(),
      plantilla: false,
      value: 0,
      createdAt: Date.now(),
    };
    const findDocumento = await this.documentoService.findmiDocumento(
      documento.codigo, this.proyId.toString()
    );
    if (findDocumento) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Este documento ya existe!",
      });
    } else {
      await this.documentoService.createmiDocumento(documento);
      this.updateList();
      this.addDocumentoForm.reset();
      setTimeout(() => this.inputEl.nativeElement.focus(), 500);
    }
  }

  deleteDocumento(documento) {
    Swal.fire({
      title: 'Esta seguro de eliminar este documento?',
      text: 'No podrás revertir este proceso!',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Eliminar!'
    }).then(async (result) => {
      if (result.value) {
        await this.documentoService.deletemiDocumento(documento._id);
        this.updateList();
        Swal.fire(
          'Eliminado!',
          'El documento ha sio eliminado.',
          'success'
        );
      }
    });
  }

  async updateList(): Promise<any> {
    this.documentos = await this.documentoService.loadmiDocumentoProyecto(
      this.proyId.toString()
    );
  }

  goPlantilla(p): any {
    this.router.navigate(["/proyecto", this.proyId.toString(), p._id.toString(), "miplantilla"]);
  }

  goLibro(p): any {
    this.router.navigate(["/proyecto", this.proyId.toString(), p._id.toString(), "milibro"]);
  }

  buscarDocumento(p): any {
    this.router.navigate(["/proyecto", this.proyId.toString(), p._id.toString(), "mibusqueda"]);
  }
}
