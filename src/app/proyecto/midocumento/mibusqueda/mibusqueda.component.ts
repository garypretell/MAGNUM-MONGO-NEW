import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { NgxSpinnerService } from "ngx-spinner";
import Swal from "sweetalert2";
import * as _ from "underscore";
import { HomeService } from "../../../core/services/home/home.service";
import { DocumentService } from '../../../core/services/document/document.service';
import { RecordService } from "../../../core/services/record/record.service";
import { TemplateService } from "../../../core/services/template/template.service";
import { ProyectoService } from '../../../core/services/proyecto/proyecto.service';
import { ElectronService } from '../../../core/services';
var ObjectID = require('mongodb').ObjectID;
declare var jQuery: any;
declare const $;

@Component({
  selector: 'app-mibusqueda',
  templateUrl: './mibusqueda.component.html',
  styleUrls: ['./mibusqueda.component.scss']
})
export class MibusquedaComponent implements OnInit, OnDestroy {
  @ViewChild("myModalEditS") myModalEditS: ElementRef;
  userFilterF: any = { estado: "true" };
  userFilterV: any = { visible: "true" };
  searchObject: any = {};
  docId;
  fields;
  documento: any = {};

  records: any = [];
  outRecords;
  p = 1;
  myTemplate;
  data;

  proyId: any;
  proyecto: any;

  editObject: any = {};
  registrotoEdit: any = {};
  constructor(
    public auth: HomeService,
    public formBuilder: FormBuilder,
    public router: Router,
    private activatedroute: ActivatedRoute,
    private spinner: NgxSpinnerService,
    public documentoService: DocumentService,
    public templateService: TemplateService,
    public recordService: RecordService,
    public proyectoService: ProyectoService,
    private electronService: ElectronService,
  ) { }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
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
          this.proyecto = await this.proyectoService.findmiProyecto(
            this.proyId
          );
          this.fields = await this.templateService.findmiTemplatebyDocumento(
            this.docId.toString()
          );
        })
      )
      .subscribe();
  }

  goHome(): any {
    this.router.navigate(["/detail"]);
  }

  goDocumentos(): any {
    this.router.navigate(["/proyecto", this.proyId.toString(), "midocumento"]);
  }

  filterResult(results, keyToFilter, valueStartsWith) {
    return _.filter(results, function (d) {
      return d[keyToFilter].startsWith(valueStartsWith);
    });
  }

  async search(obj) {
    const fields = this.fields.campos.filter((f) => f.busqueda === true);
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
    const out = await this.recordService.searchRecord(objeto);
    this.outRecords = out;
  }

  keytab(event) {
    $("input").keydown(function (e) {
      if (e.which === 13) {
        const index = $("input").index(this) + 1;
        $("input").eq(index).focus();
      }
    });
  }

  printPhoto(item) {
    const shell = require("electron").shell;
    const fs = require("fs");
    if (fs.existsSync(item.path)) {
      shell.openExternal(item.path);
      return;
    } else {
      const ruta = item.path.substr(0, item.path.lastIndexOf(".")) + ".tif";
      if (fs.existsSync(ruta)) {
        shell.openExternal(ruta);
        return;
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Image not found!",
        });
      }
    }
  }

  printRegistro(item) {
    if (
      this.electronService.fs.existsSync(`M:/templates/${item.documento}.html`)
    ) {
      this.data = item;
      var temp = this.electronService.fs
        .readFileSync(`M:/templates/${item.documento}.html`)
        .toString();
      this.myTemplate = temp.replace(/{{([^}}]+)?}}/g, ($1, $2) =>
        $2.split(".").reduce((p, c) => (p ? p[c] : ""), this)
      );
      this.spinner.show();
      setTimeout(() => {
        if (this.myTemplate) {
          let printContents, popupWin;
          printContents = document.getElementById("print-section").innerHTML;
          popupWin = window.open(
            "",
            "_blank",
            "width=" + screen.width + ",height=" + screen.height
          );
          popupWin.document.open();
          popupWin.document.write(`
      <html>
        <head>
          <title>Print tab</title>
          <link rel="stylesheet preload" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
          <style>
          .mm {
            border-top: 1px dotted rgb(49, 43, 43) ;
            color: #fff;
            background-color: #fff;
            height: 1px;
        }
        a {
            border-bottom:1px dotted #9999CC;
            text-decoration:none;
          }
          * {
            font-size: 0.93rem;
          }
          @media print{
            @page {size: Landscape}
            .printTD{
            display: inherit;
            }
            thead {
            display: table-row-group
            }
            td{
            overflow-wrap: break-word;
            word-break: break-word;
            }
            }
          </style>
        </head>
    <body onload="window.print();window.close()">${printContents}
    <script src="https://code.jquery.com/jquery-3.4.1.slim.min.js" integrity="sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossorigin="anonymous"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js" integrity="sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6" crossorigin="anonymous"></script>
    </body>
      </html>`);
          popupWin.document.close();
        }
        this.spinner.hide();
      }, 1000);
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Template does not exist!",
      });
    }
  }

}
