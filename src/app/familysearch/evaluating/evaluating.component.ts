import {
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { Location } from "@angular/common";
import { isNil, reverse } from "lodash";
import { TreeviewItem, TreeviewConfig, TreeviewComponent } from "ngx-treeview";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ElectronService } from "../../core/services";
import Swal from "sweetalert2";
import panzoom from "panzoom";
import { map } from "rxjs/operators";
import { DocumentService } from "../../core/services/document/document.service";
import { FolderService } from "../../core/services/folder/folder.service";
import { ImageService } from "../../core/services/images/images.service";
import { RecordService } from "../../core/services/record/record.service";
import { TemplateService } from "../../core/services/template/template.service";
import { ProyectoService } from "../../core/services/proyecto/proyecto.service";
import * as $ from "jquery";
var ObjectID = require("mongodb").ObjectID;

@Component({
  selector: "app-evaluating",
  templateUrl: "./evaluating.component.html",
  styleUrls: ["./evaluating.component.scss"],
})
export class EvaluatingComponent implements OnInit {
  @ViewChild("scene") scene: ElementRef;
  panZoomController;
  zoomLevels: number[];

  idFolder;
  folder;
  campos;
  documento: any = {};
  user;
  image;
  imgObj: any = {};

  newObject: any = {};
  editObject: any = {};

  proyId;
  proyecto;
  documentos = [];
  constructor(
    public formBuilder: FormBuilder,
    private activatedroute: ActivatedRoute,
    public router: Router,
    private electronService: ElectronService,
    public folderService: FolderService,
    public documentService: DocumentService,
    public templateService: TemplateService,
    public imageService: ImageService,
    public recordService: RecordService,
    public proyectoService: ProyectoService,
    private _location: Location
  ) {}

  @HostListener("document:keydown", ["$event"])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === "F2" || event.key === "F3" || event.key === "F4" || event.key === "F5" || event.key === "F6" || event.key === "F7" || event.key === "F8" ) {
      this.addTipo();
    }
    if (event.key === "F12") {
      this.add();
    }
  }
 

  sub;
  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem("user"));
    this.sub = this.activatedroute.paramMap
      .pipe(
        map(async (params: any) => {
          this.proyId = new ObjectID(params.get("p"));
          this.proyecto = await this.proyectoService.findmiProyecto(this.proyId);
          this.documentos = await this.documentService.loadmiDocumentoProyecto(
            this.proyId.toString()
          );
          this.idFolder = new ObjectID(params.get("id"));
          this.folder = await this.folderService.findFolderbyId(this.idFolder);
          const temp: any = await this.documentService.searchmiDocumento({
            nombre: this.folder.document,
            proyecto: this.proyId.toString(),
          });
          if (temp) {
            this.campos = await this.templateService.findmiTemplatebyDocumento(
              temp._id.toString()
            );
            this.documento = temp;
          }
          this.loadImage();
          $("input:text:visible:first").focus();
        })
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  async loadImage() {
    var listImages: any = await this.imageService.findImageOne({
      idFolder: this.idFolder.toString(),
      status: 1
    });
    var contador = await this.imageService.findImageOne({
      idFolder: this.idFolder.toString()
    });
    if (listImages) {
      this.imgObj = listImages;
      var temp = await this.recordService.searchRecordOne({
        path: this.imgObj.pathname
      });
      this.newObject = temp;
      var preview: any = document.getElementById("scene");
      preview.src = listImages.pathname;
      if (preview.src) {
        this.zoomLevels = [0.1, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.5, 3];
        if (!this.panZoomController) {
          this.panZoomController = panzoom(this.scene.nativeElement);
        }
      }
      setTimeout(() => $("input:text:visible:first").focus(), 1000);
    } else {
      if (contador) {
        Swal.fire({
          title: "Carpeta Evaluada...",
          icon: "warning",
          text: "No hay imágenes por evaluar!",
          showCancelButton: true,
          cancelButtonText: "Cancelar",
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Siguiente",
        }).then(async (result) => {
          if (result.value) {
            await this.folderService.updateFolder(this.idFolder, {
              status: "COMPLETE",
            });
            this.router.navigate(["/familysearch", this.proyId.toString()]);
          }
        });
      }
    }
  }

  goList() {
    this._location.back();
  }

  goHome() {
    this.router.navigate(["/detail"]);
  }

  keytab(event) {
    $("input").keydown(function (e) {
      if (e.which === 13) {
        const index = $("input").index(this) + 1;
        $("input").eq(index).focus();
      }
    });
  }

  async add() {
    this.image = null;
    await this.recordService.updateRecord(this.newObject._id, this.newObject);
    await this.imageService.updateImage(this.imgObj._id, { status: 2 });
    this.newObject = {};
    this.loadImage();
    $("input:text:visible:first").focus();
  }

  async addTipo() {
    this.image = null;
    await this.imageService.updateImage(this.imgObj._id, { status: 2 });
    this.newObject = {};
    this.loadImage();
    $("input:text:visible:first").focus();
  }
}
