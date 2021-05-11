import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  OnInit,
  ViewChild,
  Renderer2,
  HostListener,
} from "@angular/core";
import { Location } from "@angular/common";
import { isNil, reverse } from "lodash";
import { TreeviewItem, TreeviewConfig, TreeviewComponent } from "ngx-treeview";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ElectronService } from "../../core/services";
import * as _ from "underscore";
import Swal from "sweetalert2";
import { map } from "rxjs/operators";
import panzoom from "panzoom";
import { FolderService } from "../../core/services/folder/folder.service";
import { DocumentService } from "../../core/services/document/document.service";
import { RecordService } from "../../core/services/record/record.service";
import { TemplateService } from "../../core/services/template/template.service";
import { ImageService } from "../../core/services/images/images.service";
import { SpeechRecognitionService } from '../../core/services/speech/speech-recognition.service';
var ObjectID = require("mongodb").ObjectID;
import * as $ from "jquery";
import { ProyectoService } from "../../core/services/proyecto/proyecto.service";
import { BookService } from "../../core/services/book/book.service";
export const createDirectoryItem = (name, fullpath, children = []) => {
  return {
    name: name,
    fullpath: fullpath,
    children: children,
  };
};
@Component({
  selector: "app-indexing",
  templateUrl: "./indexing.component.html",
  styleUrls: ["./indexing.component.scss"],
})
export class IndexingComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild("scene") scene: ElementRef;
  panZoomController;
  zoomLevels: number[];

  @ViewChild(TreeviewComponent, { static: false })
  treeviewComponent: TreeviewComponent;
  mostrar = false;
  checkBoxValue = false;
  user;
  image;
  folder: any;
  campos;
  idFolder;
  folderPath;
  items;
  renamedObj;
  valueList = [];
  itemsList2;
  documento: any = {};
  downlineItems: any[];
  miH = innerHeight / 1.5;
  rotateAngle = 90;
  angle = 0;
  config = TreeviewConfig.create({
    hasAllCheckBox: true,
    hasFilter: true,
    hasCollapseExpand: true,
    maxHeight: this.miH,
  });
  imgObj: any = {};
  newObject: any = {};
  contador: any;
  public addImagesForm: FormGroup;
  imageObject = [];

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
    public bookService: BookService,
    private renderer: Renderer2,
    private _location: Location

  ) {
    this.addImagesForm = this.formBuilder.group({
      document: ["", [Validators.required]],
      numLibro: ["", [Validators.required]],
      ubicacion: ["", [Validators.required]],
    });
  }

  @HostListener("document:keydown", ["$event"])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === "F2") {
      this.addTipo(2);
    }
    if (event.key === "F3") {
      this.addTipo(3);
    }
    if (event.key === "F4") {
      this.addTipo(4);
    }
    if (event.key === "F5") {
      this.addTipo(5);
    }
    if (event.key === "F6") {
      this.addTipo(6);
    }
    if (event.key === "F7") {
      this.addTipo(7);
    }
    if (event.key === "F8") {
      this.addTipo(8);
    }
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  sub;
  async ngOnInit() {
    this.user = JSON.parse(localStorage.getItem("user"));
    this.sub = this.activatedroute.paramMap
      .pipe(
        map(async (params: any) => {
          this.proyId = new ObjectID(params.get("p"));
          this.proyecto = await this.proyectoService.findmiProyecto(
            this.proyId
          );
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
          this.valueList = await this.imageService.findImages({
            idFolder: this.idFolder.toString(),
          });
          if (this.valueList.length > 0) {
            this.mostrar = true;
          }
          const dirTree = require("directory-tree");
          const filteredTree = dirTree(`M://${this.folder.pathname}`);
          this.folderPath = `M:/${this.folder.pathname}`;
          this.items = filteredTree.children;
          const newKeys = {
            name: "text",
          };
          this.renamedObj = this.renameKeys(filteredTree, newKeys);
          [this.renamedObj].forEach(this.addId(1));
          this.valueList.map((f) =>
            [this.renamedObj].forEach(this.updateData(f.value))
          );
          this.itemsList2 = [this.renamedObj].map((value: any) => {
            return new TreeviewItem({
              text: value.text,
              value: value.value,
              children: value.children,
              checked: value.checked,
              disabled: value.disabled,
            });
          });
          this.loadImage();
          $("input:text:visible:first").focus();
        })
      )
      .subscribe();
    this.contador = await this.recordService.countRecords();
    this.recordService.enviar(this.contador);
  }

  addId(id: number) {
    return function iter(o) {
      if ("path" in o) {
        o.checked = true;
        o.disabled = true;
        o.value = id++;
      }
      Object.keys(o).forEach(function (k) {
        Array.isArray(o[k]) && o[k].forEach(iter);
      });
    };
  }

  rotate() {
    var preview: any = document.getElementById("scene");
    this.angle = (this.angle + 90) % 360;
    preview.className = "rotate" + this.angle;
    this.panZoomController = panzoom(this.scene.nativeElement);
  }

  renameKeys(obj, newKeys) {
    const keyValues = Object.keys(obj).map((key) => {
      let newKey = null;
      if (key === "name") {
        newKey = newKeys.name;
      } else {
        newKey = key;
      }
      if (key === "children") {
        obj[key] = obj[key].map((obj) => this.renameKeys(obj, newKeys));
      }
      return {
        [newKey]: obj[key],
      };
    });
    return Object.assign({}, ...keyValues);
  }

  onSelectedChange(downlineItems: any[]): void {
    downlineItems.forEach((downlineItem) => {
      const item = downlineItem.item;
      this.imageObject.push({
        image: "M:/" + this.folder.pathname + "/" + item.text,
        thumbImage: "M:/" + this.folder.pathname + "/" + item.text,
      });
    });
    this.downlineItems = downlineItems;
  }

  onFilterChange(e): void {}

  updateData(m: number) {
    return function iter(o) {
      if (o.value == m) {
        o.disabled = true;
        o.checked = true;
      }
      Object.keys(o).forEach(function (k) {
        Array.isArray(o[k]) && o[k].forEach(iter);
      });
    };
  }

  goList() {
    this._location.back();
    // this.router.navigate(["/familysearch", this.proyId.toString() ]);
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

  async addImages() {
    const libro: any = {
      contador: 0,
      ubicacion: this.addImagesForm.value.ubicacion,
      documento: this.addImagesForm.value.document,
      nomdoc: this.addImagesForm.value.document.replace(/ /g, ""),
      numLibro: this.addImagesForm.value.numLibro,
      createdAt: Date.now(),
      imagenes: [],
      state: 0,
      plantilla: false,
      plantillaLibro: false,
      plantillaImagen: false,
      uid: this.user.uid,
      id:
        this.proyId.toString() +
        "_" +
        this.addImagesForm.value.document.replace(/ /g, "") +
        "_" +
        this.addImagesForm.value.numLibro,
      idFolder: this.idFolder,
      proyectoid: this.proyId.toString(),
    };

    await this.bookService
      .createBook(libro)
      .then(() => {
        this.downlineItems.map((downlineItem: any) => {
          const item = downlineItem.item;
          const data: any = {
            idFolder: this.idFolder.toString(),
            pathname: this.folderPath + "/" + item.text,
            name: item.text.replace(/ /g, ""),
            value: item.value,
            date: Date.now(),
            status: 0,
            document: this.addImagesForm.value.document,
            ubicacion: this.addImagesForm.value.ubicacion,
            drive: null
          };
          this.imageService.createImage(data);
        });
        this.mostrar = true;
      })
      .catch(() => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Este libro ya existe!",
        });
        return;
      });
  }

  async goImages() {
    await this.folderService.updateFolder(this.idFolder, {
      document: this.addImagesForm.value.document,
    });

    this.valueList = await this.imageService.findImages({
      idFolder: this.idFolder.toString(),
    });
    var temp2: any = await this.documentService.searchmiDocumento({
      nombre: this.addImagesForm.value.document,
      proyecto: this.proyId.toString(),
    });

    if (temp2) {
      this.campos = await this.templateService.findmiTemplatebyDocumento(
        temp2._id.toString()
      );
      this.documento = temp2;
    }
    await this.loadImage();
  }

  async loadImage() {
    const listImages: any = await this.imageService.findImageOne({
      idFolder: this.idFolder.toString(),
      status: 0,
    });

    const contador = await this.imageService.findImageOne({
      idFolder: this.idFolder.toString(),
    });
    if (listImages) {
      this.imgObj = listImages;
      var preview: any = document.getElementById("scene");
      preview.src = listImages.pathname;
      if (preview.src) {
        this.zoomLevels = [0.1, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.5, 3];
        if (!this.panZoomController) {
          this.panZoomController = panzoom(this.scene.nativeElement);
        }
      }
    } else {
      if (contador) {
        Swal.fire({
          title: "Carpeta Finalizada...",
          icon: "warning",
          text: "No hay imágenes para indexar!",
          showCancelButton: true,
          cancelButtonText: "Cancelar",
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Siguiente",
        }).then(async (result) => {
          if (result.value) {
            await this.folderService.updateFolder(this.idFolder, {
              status: "EVALUATING",
            });
            this.router.navigate(["/familysearch", this.proyId.toString()]);
          }
        });
      }
    }
    // setTimeout(() => $("input:text:visible:first").focus(), 1000);
  }

  async nextImage() {
    await this.imageService.updateImage(this.imgObj._id, { status: 1 });
    this.loadImage();
  }

  async add(registro) {
    registro.idFolder = this.idFolder;
    registro.ubicacion = this.imgObj.ubicacion;
    registro.proyectoid = this.proyId.toString();
    registro.path = this.imgObj.pathname;
    registro.libro = this.imgObj.idFolder;
    registro.createdAt = Date.parse(new Date().toISOString().substring(0, 10));
    registro.mifecha = Date.parse(new Date().toISOString());
    registro.usuarioid = this.user.uid;
    registro.documento = this.documento.name;
    registro.estado = 12;
    registro.drive = null;
    await this.recordService.createRecord(registro);
    this.newObject = {};
    registro = null;
    if (!this.checkBoxValue) {
      this.image = null;
      this.nextImage();
    }
    this.contador += 1;
    this.recordService.enviar(this.contador);
    $("input:text:visible:first").focus();
  }

  async addTipo(tipo) {
    const registro: any = {};
    registro.idFolder = this.idFolder;
    registro.ubicacion = this.imgObj.ubicacion;
    registro.proyectoid = this.proyId.toString();
    registro.path = this.imgObj.pathname;
    registro.libro = this.imgObj.idFolder;
    registro.createdAt = Date.parse(new Date().toISOString().substring(0, 10));
    registro.mifecha = Date.parse(new Date().toISOString());
    registro.usuarioid = this.user.uid;
    registro.documento = this.documento.name;
    registro.estado = tipo;
    await this.recordService.createRecord(registro);
    this.newObject = {};
    if (!this.checkBoxValue) {
      this.image = null;
      this.nextImage();
    }
    this.contador += 1;
    this.recordService.enviar(this.contador);
    $("input:text:visible:first").focus();
  }

  aa() {
    this.contador += 1;
    this.recordService.enviar(this.contador);
  }

  ngAfterViewInit() {}
}
