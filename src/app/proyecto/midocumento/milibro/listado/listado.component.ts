import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { BookService } from '../../../../core/services/book/book.service';
import { DocumentService } from '../../../../core/services/document/document.service';
import { ProyectoService } from '../../../../core/services/proyecto/proyecto.service';
const ObjectID = require("mongodb").ObjectID;
declare const jQuery: any;
declare const $;

@Component({
  selector: 'app-listado',
  templateUrl: './listado.component.html',
  styleUrls: ['./listado.component.scss']
})
export class ListadoComponent implements OnInit {
  docId: any;
  documento: any = {};
  topList: any = [];
  fields;
  books;
  user;

  proyId: any;
  proyecto: any;
  constructor(
    public formBuilder: FormBuilder,
    public router: Router,
    public documentoService: DocumentService,
    public bookService : BookService,
    private activatedroute: ActivatedRoute,
    public proyectoService: ProyectoService,
  ) { }

  sub;
  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user'));
    this.sub = this.activatedroute.paramMap
      .pipe(
        map(async (params) => {
          this.proyId = new ObjectID(params.get("p"));
          this.docId = new ObjectID(params.get("d"));
          this.documento = await this.documentoService.findmiDocumentobyId(
            this.docId
          );
          this.proyecto = await this.proyectoService.findmiProyecto(this.proyId);
          this.topList = await this.bookService.showBooks(this.documento.name, this.proyId.toString());
        })
      )
      .subscribe();
  }

  trackByFn(index, item) {
    return item._id;
  }

  goRegistrar(libro): any {
    this.router.navigate(["/proyecto", this.proyId.toString(), this.docId.toString(), "milibro", libro.numLibro]);
  }

  goDocumentos() {
    this.router.navigate(["/proyecto", this.proyId.toString(), "midocumento"]);
  }

  goHome() {
    this.router.navigate(['/detail' ]);
  }

  goListado(libro): any {
    this.router.navigate(["/proyecto", this.proyId.toString(), this.docId.toString(), "milibro", libro.numLibro, "lista"]);
  }

  goLibros(): any {
    this.router.navigate(["/proyecto", this.proyId.toString(), this.docId.toString(), "milibro"]);
  }
}
