import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { Location } from "@angular/common";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { map } from "rxjs/operators";
import Swal from "sweetalert2";
import * as _ from "underscore";
import { DocumentService } from "../../../core/services/document/document.service";
import { ProyectoService } from "../../../core/services/proyecto/proyecto.service";
import { BookService } from "../../../core/services/book/book.service";
const ObjectID = require("mongodb").ObjectID;
declare const jQuery: any;
declare const $;

@Component({
  selector: "app-milibro",
  templateUrl: "./milibro.component.html",
  styleUrls: ["./milibro.component.scss"],
})
export class MilibroComponent implements OnInit, OnDestroy {
  @ViewChild("inputEl") inputEl: ElementRef;
  @ViewChild("addMLibro") addMLibro: ElementRef;
  addLibroForm: FormGroup;

  docId;
  topList: any = [];
  fields;
  books;
  user;
  numLibro: any;
  tipoBusqueda = true;
  proyId: any;
  proyecto: any;
  documento: any = {};
  constructor(
    public formBuilder: FormBuilder,
    public router: Router,
    public activatedroute: ActivatedRoute,
    public documentoService: DocumentService,
    public proyectoService: ProyectoService,
    public bookService: BookService,
    private _location: Location
  ) {
    this.addLibroForm = this.formBuilder.group({
      numLibro: ["", [Validators.required]],
      recordsLength: ["", [Validators.required]],
    });
  }

  sub;
  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem("user"));
    this.sub = this.activatedroute.paramMap
      .pipe(
        map(async (params) => {
          this.proyId = new ObjectID(params.get("p"));
          this.docId = new ObjectID(params.get("d"));
          this.documento = await this.documentoService.findmiDocumentobyId(
            this.docId
          );
          this.proyecto = await this.proyectoService.findmiProyecto(
            this.proyId
          );
          this.updateData();
        })
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  goDocumentos(): any {
    this.router.navigate(["/proyecto", this.proyId.toString(), "midocumento"]);
  }

  goHome(): any {
    this.router.navigate(["/detail"]);
  }

  showModal(): any {
    jQuery(this.addMLibro.nativeElement).modal("show");
    setTimeout(() => this.inputEl.nativeElement.focus(), 500);
  }

  async addLibro(): Promise<any> {
    const libro: any = {
      contador: 0,
      documento: this.documento.name,
      nomdoc: this.documento.nombre,
      numLibro: this.addLibroForm.value.numLibro,
      recordsLength: this.addLibroForm.value.recordsLength,
      createdAt: Date.now(),
      imagenes: [],
      state: 0,
      plantilla: false,
      plantillaLibro: false,
      plantillaImagen: false,
      uid: this.user.uid,
      id: `${this.proyId.toString()}_${this.documento.value.name}_${
        this.addLibroForm.value.numLibro
      }`,
      proyectoid: this.proyId.toString(),
      idFolder: null,
    };
    const temp = await this.bookService.findBookbyBook_Document(
      this.addLibroForm.value.numLibro,
      this.documento.name,
      this.proyId.toString()
    );
    if (temp) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Este libro ya existe!",
      });
    } else {
      await this.bookService.createBook(libro);
      this.updateData();
      this.addLibroForm.reset();
      setTimeout(() => this.inputEl.nativeElement.focus(), 500);
    }
  }

  async updateData(): Promise<any> {
    this.topList = await this.bookService.limitBooks(
      this.documento.name,
      this.proyId.toString(),
      6
    );
  }

  mostrarTodo(): any {
    this.router.navigate([
      "/proyecto",
      this.proyId.toString(),
      this.docId.toString(),
      "listado",
    ]);
  }

  goRegistrar(libro): any {
    this.router.navigate([
      "/proyecto",
      this.proyId.toString(),
      this.docId.toString(),
      "milibro",
      libro.numLibro,
    ]);
  }

  goListado(libro): any {
    this.router.navigate([
      "/proyecto",
      this.proyId.toString(),
      this.docId.toString(),
      "milibro",
      libro.numLibro,
      "lista",
    ]);
  }

  async goLibro(): Promise<any> {
    if (this.numLibro) {
      const book = await this.bookService.findBookbyBook_Document(
        +this.numLibro,
        this.documento.name,
        this.proyId.toString()
      );
      if (book) {
        if (this.tipoBusqueda) {
          this.router.navigate([
            "/proyecto",
            this.proyId.toString(),
            this.docId.toString(),
            "milibro",
            this.numLibro,
          ]);
        } else {
          this.router.navigate([
            "/proyecto",
            this.proyId.toString(),
            this.docId.toString(),
            "milibro",
            this.numLibro,
            "lista",
          ]);
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Este libro no existe!",
        });
        this.numLibro = null;
      }
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Ingrese número de libro a buscar!",
      });
    }
  }
}
