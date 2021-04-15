import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import Swal from "sweetalert2";
import { map } from "rxjs/operators";
import { Location } from "@angular/common";
import { DocumentService } from "../../../../core/services/document/document.service";
import { TemplateService } from "../../../../core/services/template/template.service";
import { RecordService } from "../../../../core/services/record/record.service";
import { ProyectoService } from "../../../../core/services/proyecto/proyecto.service";
import { BookService } from "../../../../core/services/book/book.service";
const ObjectID = require("mongodb").ObjectID;
declare var jQuery: any;
declare const $;

@Component({
  selector: "app-detalle",
  templateUrl: "./detalle.component.html",
  styleUrls: ["./detalle.component.scss"],
})
export class DetalleComponent implements OnInit {
  @ViewChild("myModalEditS") myModalEditS: ElementRef;
  recordId;
  newObject: any = {};
  editObject: any = {};
  registrotoEdit: any = {};
  userFilterF: any = { estado: "true" };
  userFilterV: any = { visible: "true" };
  records: any = [];
  user;
  numBook: any;
  docId;
  fields;
  documento: any = {};
  libro: any;

  contador: any;
  proyId: any;
  proyecto: any;
  constructor(
    public formBuilder: FormBuilder,
    public router: Router,
    public documentoService: DocumentService,
    public templateService: TemplateService,
    public recordService: RecordService,
    public activatedroute: ActivatedRoute,
    public proyectoService: ProyectoService,
    public bookService: BookService,
    private _location: Location
  ) {}

  sub;
  ngOnInit(): any {
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
          this.numBook = +params.get("l");
          this.fields = await this.templateService.findmiTemplatebyDocumento(
            this.docId.toString()
          );
          this.libro = await this.bookService.searchBookID(
            `${this.proyId.toString()}_${this.documento.codigo}_${this.numBook}`
          );
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

  goListado(): any {
    this.router.navigate([
      "/proyecto",
      this.proyId.toString(),
      this.docId.toString(),
      "milibro",
      this.numBook,
      "lista",
    ]);
  }

  goLibro(): any {
    this.router.navigate(["/proyecto", this.proyId.toString(), this.docId.toString(), "milibro"]);
  }

  goHome(): any {
    this.router.navigate(["/detail"]);
  }

  goDocumento() {
    this.router.navigate(["/proyecto", this.proyId.toString(), "midocumento"]);
  }

  async add(registro): Promise<any> {
    try {
      registro.proyectoid = this.proyId.toString();
      registro.path = "sin imagen";
      if (this.libro) {
        registro.libro = this.libro.idFolder.toString();
        registro.idFolder = this.libro.idFolder;
      } else {
        registro.libro = null;
        registro.idFolder = null;
      }
      registro.numlibro = parseFloat(this.numBook);

      registro.createdAt = Date.parse(
        new Date().toISOString().substring(0, 10)
      );
      registro.mifecha = Date.parse(new Date().toISOString());
      registro.usuarioid = this.user.uid;
      registro.documento = this.documento.name;
      await this.recordService.createRecord(registro);
      this.updateData();
      this.newObject = {};
      registro = null;
      this.contador += 1;
      this.recordService.enviar(this.contador);
      $("input:enabled:visible:first").focus();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "There was an unexpected error!",
      });
    }
  }

  deleteRegistro(registro): any {
    Swal.fire({
      title: "Esta seguro de eliminar este registro?",
      text: "No podrá revertir esta operación!",
      icon: "warning",
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, Eliminar!",
    }).then(async (result) => {
      if (result.value) {
        await this.recordService.deleteRecord(registro._id);
        this.contador -= 1;
        this.recordService.enviar(this.contador);
        this.updateData();
        Swal.fire("Eliminado!", "El registro ha sido eliminado.", "success");
      }
    });
  }

  keytab(event): any {
    $("input").keydown(function (e) {
      if (e.which === 13) {
        const index = $("input").index(this) + 1;
        $("input").eq(index).focus();
      }
    });
  }

  async updateData(): Promise<any> {
    if (this.libro) {
      this.records = await this.recordService.limitRecords(
        this.documento.codigo,
        this.libro.idFolder.toString(),
        6
      );
    } else {
      this.records = await this.recordService.limitRecordsTwo(
        this.documento.codigo,
        this.proyId.toString(),
        +this.numBook,
        6
      );
    }
  }

  async enableEditing($event, item): Promise<any> {
    const record = await this.recordService.findRecordbyId(item._id);
    this.registrotoEdit = record;
    this.editObject = record;
    this.recordId = item._id;
    jQuery(this.myModalEditS.nativeElement).modal("show");
  }

  async updateRegistroS(registrotoEdit): Promise<any> {
    await this.recordService.updateRecord(this.recordId, this.editObject);
    this.updateData();
    jQuery(this.myModalEditS.nativeElement).modal("hide");
  }
}
