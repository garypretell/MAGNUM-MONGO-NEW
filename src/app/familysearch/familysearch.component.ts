import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { isNil, reverse } from "lodash";
import { TreeviewItem, TreeviewConfig, TreeviewComponent } from "ngx-treeview";
import { ActivatedRoute, Router } from "@angular/router";
import { ElectronService } from "../core/services";
import * as _ from "underscore";
import Swal from "sweetalert2";
import { map } from "rxjs/operators";
import { FolderService } from "../core/services/folder/folder.service";
import { DocumentService } from "../core/services/document/document.service";
import { TemplateService } from "../core/services/template/template.service";
import { RecordService } from "../core/services/record/record.service";
import { ProyectoService } from "../core/services/proyecto/proyecto.service";
const ObjectID = require("mongodb").ObjectID;
export const createDirectoryItem = (name, fullpath, children = []) => {
  return {
    name: name,
    fullpath: fullpath,
    children: children,
  };
};

@Component({
  selector: "app-familysearch",
  templateUrl: "./familysearch.component.html",
  styleUrls: ["./familysearch.component.scss"],
})
export class FamilysearchComponent implements OnInit, OnDestroy {
  @ViewChild(TreeviewComponent, { static: false })
  treeviewComponent: TreeviewComponent;
  p = 1;
  user;
  renamedObj;
  itemsList2: any;
  statusList;
  downlineItems: any[];
  miH = innerHeight / 1.5;
  config = TreeviewConfig.create({
    hasAllCheckBox: true,
    hasFilter: true,
    hasCollapseExpand: true,
    maxHeight: this.miH,
  });
  folders;
  estado;
  miarray = [];
  proyId: any;
  proyecto: any;
  documentos: any = [];
  constructor(
    public router: Router,
    public folderService: FolderService,
    public documentService: DocumentService,
    public templateService: TemplateService,
    public recordService: RecordService,
    private electronService: ElectronService,
    public proyectoService: ProyectoService,
    public activatedroute: ActivatedRoute
  ) {}

  sub;
  async ngOnInit() {
    this.estado = "INDEXING";
    this.user = JSON.parse(localStorage.getItem("user"));
    this.sub = this.activatedroute.paramMap
      .pipe(
        map(async (params) => {
          this.proyId = new ObjectID(params.get("p"));
          this.proyecto = await this.proyectoService.findmiProyecto(
            this.proyId
          );
          this.documentos = await this.documentService.loadmiDocumentoProyecto(
            this.proyId.toString()
          );
        })
      )
      .subscribe();
    this.statusList = await this.folderService.findCarpeta({
      status: "INDEXING",
      proyectoid: this.proyId.toString(),
    });
    this.updateFolder();
    if (!this.electronService.fs.existsSync("M:/Reportes"))
      this.electronService.fs.mkdirSync("M:/Reportes");
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  addId(id: number) {
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    return function iter(o) {
      if ("path" in o) {
        o.checked = false;
        // o.disabled = true
        o.value = id++;
      }
      Object.keys(o).forEach(function (k) {
        Array.isArray(o[k]) && o[k].forEach(iter);
      });
    };
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
      // const value = item.value;
      const texts = [item.text];
      let parent = downlineItem.parent;
      while (!isNil(parent)) {
        texts.push(parent.item.text);
        parent = parent.parent;
      }
      const reverseTexts = reverse(texts);
      // const row = `${reverseTexts.join('/')} : ${value}`;
      const row = `${reverseTexts.join("/")}`;
      item.fullpath = row;
    });
    this.downlineItems = downlineItems;
  }

  onFilterChange(e) {}

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

  deleteData(m) {
    return function iter(o) {
      if (o.name == m) {
        o.disabled = false;
        o.checked = false;
      }
      Object.keys(o).forEach(function (k) {
        Array.isArray(o[k]) && o[k].forEach(iter);
      });
    };
  }

  addFolder() {
    this.downlineItems.forEach(async (downlineItem: any) => {
      const item = downlineItem.item;
      if (item.disabled == false) {
        const data: any = {
          pathname: `Imagenes/${item.fullpath}`,
          name: item.text,
          value: item.value,
          date: Date.now(),
          status: "INDEXING",
          document: "WAITING",
          contador: 0,
          uid: this.user.uid,
          proyectoid: this.proyId.toString(),
        };
        await this.folderService.createFolder(data);
        this.statusList = await this.folderService.findCarpeta({
          status: "INDEXING",
          proyectoid: this.proyId.toString(),
        });
        this.updateFolder();
      }
    });
  }

  async updateFolder() {
    this.folders = await this.folderService.loadFolders();
    this.folders.forEach((element) => {
      this.miarray.push(new RegExp(element.name + "$"));
    });
    const dirTree = require("directory-tree");
    const filteredTree = dirTree(`M:\\Imagenes\\${this.proyecto.nombre}`, {
      exclude: this.miarray,
      extensions: /\.txt/,
    });
    const newKeys = {
      name: "text",
    };
    this.renamedObj = this.renameKeys(filteredTree, newKeys);
    [this.renamedObj].forEach(this.addId(1));
    this.itemsList2 = [this.renamedObj].map((value: any) => {
      return new TreeviewItem({
        text: value.text,
        value: value.value,
        children: value.children,
        checked: value.checked,
        disabled: value.disabled,
      });
    });
  }

  getColor(estado) {
    switch (estado) {
      case "WAITING":
        return "red";
      default:
        return "black";
    }
  }

  async goStatus(item) {
    var name = item.name.replace(/ /g, "");
    if (item.status === "COMPLETE") {
      const fs = require("fs");
      const shell = require("electron").shell;
      if (
        fs.existsSync(
          `M:/Reportes/${item.document}_${name}_${item._id.toString()}.html`
        )
      ) {
        shell.openExternal(
          `M:/Reportes/${item.document}_${name}_${item._id.toString()}.html`
        );
        return;
      } else {
        var tempDoc: any = await this.documentService.searchmiDocumento({
          nombre: item.document,
          proyecto: this.proyId.toString(),
        });
        var tempTemp: any = await this.templateService.searchmiPlantilla({
          documento: tempDoc._id.toString(),
          proyecto: this.proyId.toString(),
        });
        var tempRecord: any = await this.recordService.searchRecord({
          idFolder: item._id,
          proyectoid: this.proyId.toString(),
        });
        let lst = tempTemp.campos.filter((f: any) => f.estado !== "principal");
        var sortedObjs = _.sortBy(tempRecord, lst[0].id);
        var html =
          "<table class='noborder'><tr><td valign = 'middle=' ><big><big ><big>" +
          "Magnum" +
          "</big></big></big></td><td align = 'right'><i><b> Archives Collection Name</b></i><br/>" +
          "Magnum" +
          "</td></tr><tr><td class='smalltextmono' colspan='2'>&nbsp</td></tr></table><br/>";
        html +=
          "<html lang='en'><head><style type='text/css'> table.border {border: 2px #000000; border-style: solid;border-collapse: collapse; width: 100%;} table.noborder { border: 0px #ffffff;  border-style: none; border-collapse: collapse; width: 100%; } tr { font-family: Sans-Serif; } tr.tablerowodd { font-family: Sans-Serif;} tr.tableroweven { background-color: #ddFFFF; font-family: Sans-Serif; color: #FF0000;} th { font-weight: bold;vertical-align: top;border-style: solid; border-width: 1px; background: d0d0d0; font-size: smaller;       padding-left: 5px; padding-right: 5px; } td { border-width: 1px; border-style: solid; padding-left: 3px; padding-right: 3px; font-size: smaller; } td.barcode { border-width: 1px; border-style: solid;padding-left: 3px;padding-right: 3px; font-family: 'IDAutomationHC39M', 'Lucida Console', Verdana;font-size: 8pt; } td.smalltextmono { border-width: 1px; padding-left: 3px; padding-right: 3px; font-family: 'Lucida Console', Verdana; font-size: 8pt; } td.yellowbkg { border-width: 1px; border-style: solid; padding-left: 3px;   padding-right: 3px; font-size: smaller; background-color: #FFFF00;} thead { display: table-header-group } @media print {.page-break { display: block;  page-break-before: always; } } </style> <meta charset = 'utf-8'><meta name = 'viewport' content = 'width=device-width, initial-scale=1, shrink-to-fit=no'><title> Informe de Operador</title></head><body>";
        html +=
          "<table class='border'><tr><th> Date:</th><th colspan = '2' > Project Name</th><th> Document </th><th> Folder </th><th> Images </th><th> Records </th></tr><tr align = 'center'> <th colspan = '7' style = 'background:#f0f0f0'> &nbsp </th></tr>";
        html +=
          "<tr><td align = 'center'>" +
          new Date().toISOString().substring(0, 10) +
          "</td><td align = 'center'>" +
          "Magnum" +
          "</td>  <td class='barcode' align='center'>*" +
          "departamento" +
          "*</td> <td align = 'center'>" +
          item.document +
          "</td> <td align = 'center'>" +
          item.pathname +
          "</td> <td align = 'center'>" +
          tempRecord.length +
          "</td><td align = 'center'>" +
          tempRecord.length +
          "</td> </tr></table><br/>";
        html += "<table class='border'><thead><tr><th></th>";
        lst.forEach((l) => {
          html += "<th>" + l.nombre + "</th>";
        });
        html += "</tr></thead>";
        html += "<tbody>";
        //   return this.afs.collection(`Registros`, ref => ref.where('idFolder', '==', item.id)).valueChanges({ idField: 'id' }).pipe(map(r => {
        var temp = 0;
        sortedObjs = sortedObjs.filter((f) => f.estado === 12);
        sortedObjs.map((x, i) => {
          {
            html += "<tr class='tablerowodd'>";
            html += " <td align = 'center'>" + (temp + 1) + "</td>";
            lst.forEach((l) => {
              html += "<td align = 'center'>" + x[l.id] + "</td>";
            });
            html += "</tr>";
            html +=
              " <tr class = 'tableroweven'><td colspan =" +
              (lst.length + 1) +
              "align='left'>" +
              " &nbsp " +
              "</td></tr>";
            temp++;
          }
        });
        html += "</tbody></table><br/> ";
        html += "</body></html>";
        fs.writeFile(
          `M:/Reportes/${item.document}_${name}_${item._id}.html`,
          html,
          (error) => {
            /* handle error */
          }
        );
        shell.openExternal(
          `M:/Reportes/${item.document}_${name}_${item._id}.html`
        );
      }
      return;
    }
    this.router.navigate([
      "/familysearch",
      this.proyecto._id.toString(),
      item._id.toString(),
      item.status,
    ]);
  }

  eliminar(t: any) {
    Swal.fire({
      title: "Are you sure to delete this folder?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      cancelButtonText: "Cancel",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Delete!",
    }).then(async (result) => {
      if (result.value) {
        this.folderService.deleteFolder(t._id);
        this.statusList = await this.folderService.findCarpeta({
          status: t.status,
          proyectoid: this.proyId.toString(),
        });
        [this.renamedObj].forEach(this.deleteData(t.name));
        this.itemsList2 = Array.of(this.renamedObj).map((value: any) => {
          return new TreeviewItem({
            text: value.text,
            value: value.value,
            children: value.children,
            checked: value.checked,
            disabled: value.disabled,
          });
        });
        Swal.fire("Deleted!", "The folder has been deleted.", "success");
      }
    });
  }

  async filterList(e) {
    this.estado = e.target.value;
    this.statusList = await this.folderService.findCarpeta({
      status: e.target.value,
      proyectoid: this.proyId.toString(),
    });
  }
}
