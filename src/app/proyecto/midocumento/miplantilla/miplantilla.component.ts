import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { map } from "rxjs/operators";
import { DragulaService } from "ng2-dragula";
import { ElectronService } from "../../../core/services";
import { DocumentService } from "../../../core/services/document/document.service";
import { ProyectoService } from "../../../core/services/proyecto/proyecto.service";
import { TemplateService } from "../../../core/services/template/template.service";
import { Subscription } from "rxjs";
import Swal from "sweetalert2";
import * as _ from "underscore";
const ObjectID = require("mongodb").ObjectID;
declare const jQuery: any;
declare const $;

@Component({
  selector: 'app-miplantilla',
  templateUrl: './miplantilla.component.html',
  styleUrls: ['./miplantilla.component.scss']
})
export class MiplantillaComponent implements OnInit, OnDestroy {
  @ViewChild("myModalS") myModalS: ElementRef;
  @ViewChild("inputEl") inputEl: ElementRef;
  @ViewChild("myModalEditS") myModalEditS: ElementRef;
  searchObjectS: any = { nombre: "" };
  campotoEditS: any = {};
  public addCampoFormS: FormGroup;
  arrayTemp: any;
  proyId: any;
  docId: any;
  proyecto: any;
  documento: any = {};
  campos: any;

  idx: any;
  messagePercent = false;
  itemList: any[] = [
    { nombre: "usuarioid", tipo: "numerico" },
    { nombre: "fecharegistro", tipo: "fecha" },
  ];
  tipoArray: any[] = [
    { id: 1, nombre: "texto" },
    { id: 2, nombre: "numerico" },
    { id: 3, nombre: "fecha" },
    { id: 4, nombre: "imagen" },
  ];

  MANY_ITEMS = "MANY_ITEMS";
  subs = new Subscription();
  constructor(
    public formBuilder: FormBuilder,
    public activatedroute: ActivatedRoute,
    public documentoService: DocumentService,
    public proyectoService: ProyectoService,
    public templateService: TemplateService,
    public router: Router,
    private electronService: ElectronService,
    private dragulaService: DragulaService,
    private _location: Location
  ) {
    this.addCampoFormS = this.formBuilder.group({
      nombre: ["", [Validators.required]],
      tipo: ["", [Validators.required]],
      estado: [""],
    });

    this.subs.add(
      dragulaService
        .dropModel(this.MANY_ITEMS)
        .subscribe(
          async ({ el, target, source, sourceModel, targetModel, item }) => {
            this.arrayTemp = targetModel;
            const data = {
              campos: sourceModel,
            };
            await this.templateService.actualizarmiTemplate(this.campos._id, data);
          }
        )
    );
  }

  sub;
  ngOnInit(): void {
    this.sub = this.activatedroute.paramMap
      .pipe(
        map(async (params) => {
          this.proyId = new ObjectID(params.get("p"));
          this.docId = new ObjectID(params.get("d"));
          this.documento = await this.documentoService.findmiDocumentobyId(
            this.docId
          );
          this.campos = await this.templateService.findmiTemplatebyDocumento(
            this.docId.toString()
          );
          this.proyecto = await this.proyectoService.findmiProyecto(this.proyId);
        })
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
    this.subs.unsubscribe();
  }

  async itemListSave() {
    const items: any[] = [
      { nombre: "usuarioid", tipo: "numerico", estado: "principal" },
      { nombre: "fecharegistro", tipo: "fecha", estado: "principal" },
    ];

    await this.templateService.crearmiPlantilla({
      documento: this.docId.toString(),
      proyecto: this.proyId.toString(),
      campos: items,
    });
    await this.documentoService.updatemiDocumento(this.docId, {
      plantilla: true
    });
    await this.documentoService.removemiAfterActualizar(this.docId);
    this.campos = await this.templateService.findmiTemplatebyDocumento(
      this.docId.toString()
    );
    this.documento = await this.documentoService.findmiDocumentobyId(this.docId);
  }

  showModalS(): any {
    jQuery(this.myModalS.nativeElement).modal("show");
    setTimeout(() => this.inputEl.nativeElement.focus(), 500);
  }

  async addField() {
    if (
      this.addCampoFormS.value.nombre === "PROYECTO" ||
      this.addCampoFormS.value.nombre === "SEDE"
    ) {
      this.addCampoFormS.reset();
      return alert("Este campo está reservado por el sistema");
    }
    const data: any = {
      visible: true,
      estado: true,
      busqueda: false,
      tipo: this.addCampoFormS.value.tipo,
      nombre: this.addCampoFormS.value.nombre,
      id: this.addCampoFormS.value.nombre.replace(/ /g, ""),
    };
    var temp = [];
    this.campos.campos.map((m) => {
      temp.push(m);
    });
    temp.push(data);
    await this.templateService.actualizarmiTemplate(this.campos._id, {
      campos: temp,
    });
    this.campos = await this.templateService.findmiTemplatebyDocumento(
      this.docId.toString()
    );
    this.addCampoFormS.reset();
    setTimeout(() => this.inputEl.nativeElement.focus(), 500);
  }

  getColor(estado) {
    switch (estado) {
      case true:
        return "black";
      case false:
        return "red";
    }
  }

  async editField(field): Promise<any> {
    this.idx = this.campos.campos.findIndex((x) => x.nombre === field.nombre);
    var doc: any = await this.templateService.findmiTemplatebyDocumento(
      this.docId.toString()
    );
    this.campotoEditS = doc.campos[this.idx];
    jQuery(this.myModalEditS.nativeElement).modal("show");
  }

  deleteField(field): any {
    Swal.fire({
      title: "Esta seguro de eliminar este campo?",
      text: "No podrás revertir este proceso!",
      icon: "warning",
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, Eliminar!",
    }).then(async (result) => {
      if (result.value) {
        const idx = this.campos.campos.findIndex(
          (x) => x.nombre === field.nombre
        );
        this.campos.campos.splice(idx, 1);
        await this.templateService.actualizarmiTemplate(this.campos._id, {
          campos: this.campos.campos,
        });
        Swal.fire("Eliminado!", "El campo ha sido eliminado.", "success");
      }
    });
  }

  async updateCampoS(campotoEdit): Promise<any> {
    this.campos.campos[this.idx] = campotoEdit;
    await this.templateService.actualizarmiTemplate(this.campos._id, {
      campos: this.campos.campos,
    });
    jQuery(this.myModalEditS.nativeElement).modal("hide");
  }

  uploadFile(event) {
    const nombre = this.documento.name + ".html";
    const file = event.target.files[0];
    if (!this.electronService.fs.existsSync("M:/templates"))
      this.electronService.fs.mkdirSync("M:/templates");
    this.electronService.fs.copyFile(
      file.path,
      `M:/templates/${nombre}`,
      (err) => {
        if (err) throw err;
      }
    );
    this.messagePercent = true;
  }

  goDocumento(): any {
    this.router.navigate(["/proyecto", this.proyId.toString(), "midocumento"]);
  }

  trackByFn(index, item): any {
    return item._id;
  }

  goHome(): any {
    this.router.navigate(['/detail']);
  }

}

