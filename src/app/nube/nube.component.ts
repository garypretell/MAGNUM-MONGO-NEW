import { Component, OnInit } from "@angular/core";
import { DocumentService } from "../core/services/document/document.service";
import { ProyectoService } from "../core/services/proyecto/proyecto.service";
import { TemplateService } from "../core/services/template/template.service";
import { SettingsService } from "../core/services/settings/settings.service";
import { CloudService } from "../core/services/cloud/cloud.service";
import { HomeService } from "../core/services/home/home.service";
declare const $;

@Component({
  selector: "app-nube",
  templateUrl: "./nube.component.html",
  styleUrls: ["./nube.component.scss"],
})
export class NubeComponent implements OnInit {
  userFilterF: any = { estado: "true" };
  userFilterV: any = { visible: "true" };
  searchObject: any = {};
  proyectos;
  documentos;
  records = [];
  outRecords;
  p = 1;
  campos;
  proyecto;
  documento;
  setting;
  constructor(
    public auth: HomeService,
    public proyectoService: ProyectoService,
    public documentoService: DocumentService,
    public templateService: TemplateService,
    public settingsService: SettingsService,
    public cloudService: CloudService

  ) {}

  async ngOnInit(): Promise<any> {
    this.proyectos = await this.proyectoService.loadmiProyecto();
    this.setting = await this.settingsService.loadSettings();
  }

  async onChange(p): Promise<any> {
    this.documentos = await this.documentoService.loadmiDocumentoProyecto(
      p._id.toString()
    );
  }

  async onSelect(d): Promise<any> {
    this.outRecords = [];
    this.searchObject = {};
    this.documento = d;
    this.campos = await this.templateService.findmiTemplatebyDocumento(
      d._id.toString()
    );
  }

  async search(obj): Promise<any> {
    this.outRecords = null;
    const fields = this.campos.campos.filter((f) => f.busqueda === true);
    const result = fields.map((a) => a.id);
    const keys = Object.keys(this.searchObject);
    const fieldsLength = fields.length;
    const objeto = { documento: this.documento.name };
    for (let i = 0; i < fieldsLength; i++) {
      if (typeof obj[keys[i]] === "number") {
        objeto[result[i]] = obj[keys[i]];
      } else {
        objeto[result[i]] = new RegExp(obj[keys[i]]);
      }
    }
    const out = await this.cloudService.searchRecord( this.setting.connectionString.toString(), objeto);
    this.outRecords = out;
  }

  printRegistro(i): any {
    const shell = require("electron").shell;
    shell.openExternal(i.webViewLink);

  }

  downloadPhoto(i): any {
    // console.log(i);
    // const shell = require("electron").shell;
    // shell.openExternal(i.webContentLink);
    window.open(i.webContentLink);
  }

  keytab(event) {
    $("input").keydown(function (e) {
      if (e.which === 13) {
        const index = $("input").index(this) + 1;
        $("input").eq(index).focus();
      }
    });
  }
}
