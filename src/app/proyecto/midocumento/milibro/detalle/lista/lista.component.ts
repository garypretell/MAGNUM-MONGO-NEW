import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { HomeService } from "../../../../../core/services/home/home.service";
import { map } from "rxjs/operators";
import Swal from "sweetalert2";
import { DocumentService } from "../../../../../core/services/document/document.service";
import { RecordService } from "../../../../../core/services/record/record.service";
import { TemplateService } from "../../../../../core/services/template/template.service";
import { BookService } from "../../../../../core/services/book/book.service";
declare var jQuery: any;
import * as _ from "underscore";
import { ProyectoService } from "../../../../../core/services/proyecto/proyecto.service";
const ObjectID = require("mongodb").ObjectID;
declare const $;

@Component({
  selector: "app-lista",
  templateUrl: "./lista.component.html",
  styleUrls: ["./lista.component.scss"],
})
export class ListaComponent implements OnInit, OnDestroy {
  @ViewChild("myModalEditS") myModalEditS: ElementRef;
  searchObject: any = {};
  userFilterF: any = { estado: "true" };
  userFilterV: any = { visible: "true" };
  newObject: any = {};
  editObject: any = {};
  records: any = [];
  recordId;
  user;
  numBook: any;
  docId;
  fields;
  documento: any = {};
  p = 1;
  folder: any;

  proyId: any;
  proyecto: any;
  contador: any;
  libro: any;
  constructor(
    public formBuilder: FormBuilder,
    public router: Router,
    private activatedroute: ActivatedRoute,
    public documentoService: DocumentService,
    public templateService: TemplateService,
    public recordService: RecordService,
    private homeService: HomeService,
    private bookService: BookService,
    public proyectoService: ProyectoService
  ) {}

  sub;
  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem("user"));
    this.sub = this.activatedroute.paramMap
      .pipe(
        map(async (params) => {
          this.proyId = new ObjectID(params.get("p"));
          this.docId = new ObjectID(params.get("d"));
          this.numBook = params.get("l");
          this.documento = await this.documentoService.findmiDocumentobyId(
            this.docId
          );
          this.proyecto = await this.proyectoService.findmiProyecto(
            this.proyId
          );
          this.folder = await this.bookService.searchRecordFolder({
            document: this.documento.name,
            proyectoid: this.proyId.toString()
          });
          this.fields = await this.templateService.findmiTemplatebyDocumento(
            this.docId.toString()
          );
          this.libro = await this.bookService.searchBookID(`${this.proyId.toString()}_${this.documento.codigo}_${this.numBook}`);
          this.contador = await this.recordService.countRecords();
          this.recordService.enviar(this.contador);
          this.updateData();
        })
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  goDocumentos() {
    this.router.navigate(["/proyecto", this.proyId.toString(), "midocumento"]);
  }

  goHome() {
    this.router.navigate(["/detail"]);
  }

  goLibro() {
    this.router.navigate(["/proyecto", this.proyId.toString(), this.docId.toString(), "milibro"]);
  }

  async updateData() {
    if (this.libro) {
      const lst = this.fields.campos.filter(
        (f: any) => f.estado !== "principal"
      );
      const temp: any = await this.recordService.findRecordbyBook_Folder(
        this.libro.idFolder.toString(),
      );
      const result = temp.filter(f => f.estado === 12);
      const sortedObjs = _.sortBy(result, lst[0].id);
      this.records = sortedObjs;
    } else {
      this.records = await this.recordService.findRecordbyBook_DocumentTwo(
        this.documento.codigo,
        this.proyId.toString(),
        +this.numBook
      );
    }
  }

  async enableEditing($event, item) {
    const record = await this.recordService.findRecordbyId(item._id);
    this.editObject = record;
    this.recordId = item._id;
    jQuery(this.myModalEditS.nativeElement).modal("show");
  }

  async updateRegistroS() {
    await this.recordService.updateRecord(this.recordId, this.editObject);
    this.updateData();
    jQuery(this.myModalEditS.nativeElement).modal("hide");
  }

  deleteRegistro(registro) {
    Swal.fire({
      title: "Esta seguro d eliminar este registro?",
      text: "No podrás revertir esta operación!",
      icon: "warning",
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, Eliminar!",
    }).then(async (result) => {
      if (result.value) {
        await this.recordService.deleteRecord(registro._id);
        this.updateData();
        Swal.fire("Deleted!", "Record has been eliminated.", "success");
      }
    });
  }

  printLibro() {
    Swal.fire({
      title: "Esta seguro de exportar a EXCEL?",
      text: "No podrás revertir este proceso!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si!",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        this.homeService.exportToExcel(this.records, "my_export");
      }
    });
  }

  keytab(event) {
    $("input").keydown(function (e) {
      if (e.which === 13) {
        const index = $("input").index(this) + 1;
        $("input").eq(index).focus();
      }
    });
  }

  resetPagination(): any {
    this.p = 1;
  }
}
