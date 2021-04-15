import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of, Subject } from 'rxjs';
import { map, switchMap, takeUntil } from 'rxjs/operators';
declare const jQuery: any;
declare const $;
import { ElectronService } from '../core/services';
import Swal from 'sweetalert2';
import { DocumentService } from '../core/services/document/document.service';
import { FolderService } from '../core/services/folder/folder.service';
@Component({
  selector: 'app-capture',
  templateUrl: './capture.component.html',
  styleUrls: ['./capture.component.scss']
})
export class CaptureComponent implements OnInit {
  @ViewChild('addMLibro') addMLibro: ElementRef;
  @ViewChild('inputEl') inputEl: ElementRef;
  addFolderForm: FormGroup;
  documentos;
  listado;
  user;
  documento;
  p = 1;
  mensaje = 'Select a document to start...';
  buttonEnabled: boolean;
  searchFolder: any = { name: '' };
  constructor(
    public formBuilder: FormBuilder,
    private router: Router,
    private activatedroute: ActivatedRoute,
    public documentService: DocumentService,
    public folderService: FolderService,
  ) {
    this.addFolderForm = this.formBuilder.group({
      numFolder: ['', [Validators.required]]
    });
  }

  async ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user'));
    this.listado = await this.folderService.findFolder({status: 'INIT', uid: this.user.uid});
    this.documentos = await this.documentService.loadmiDocumento();
  }

  filterList() {
    this.mensaje = 'No items found!';
    this.buttonEnabled = true;
    this.updateList();
  }

  async createFolder() {
    var existFolder = await this.folderService.findFolderOne({ document: this.documento.nombre, name: this.addFolderForm.value.numFolder });
    const ruta = this.documento.nombre + '_' + this.addFolderForm.value.numFolder;
    const name = this.documento.nombre + '_' + this.addFolderForm.value.numFolder;
    if (existFolder) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'This book has already been registered!'
      });
      this.addFolderForm.reset();
    } else {
      var fs = require('fs');
      var dir = `M:/Imagenes/${ruta}/${name}`;
      const data: any = {
        pathname: `Imagenes/${ruta}/${name}`,
        name: this.documento.nombre + '_' + this.addFolderForm.value.numFolder,
        value: false,
        date: Date.now(),
        status: "CAPTURE",
        document: this.documento.nombre,
        contador: 0,
        uid: this.user.uid,
        imagenes: []
      };
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true }, (err) => {
          if (err) throw err;
        });
        await this.folderService.createFolder(data);
        this.updateList();
        this.addFolderForm.reset();
        jQuery(this.addMLibro.nativeElement).modal('hide');
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Este Libro ya ha sido registrado!'
        });
      }
    }

  }

  showModal() {
    jQuery(this.addMLibro.nativeElement).modal('show');
    setTimeout(() => this.inputEl.nativeElement.focus(), 500);
  }

  getColor(estado) {
    switch (estado) {
      case 'WAITING':
        return 'red';
      default:
        return 'black';
    }
  }

  async updateList() {
    this.listado = await this.folderService.findFolder({status: 'CAPTURE', uid: this.user.uid, document:  this.documento.nombre});
  }

  eliminar(item) {
    Swal.fire({
      title: 'Are you sure to delete this folder?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Delete!'
    }).then(async(result) => {
      if (result.value) {
        var ret = item.pathname.replace(`/${item.name}`, '');
        var dir = `M:/${ret}`
        this.deleteFolderRecursive(dir);
        await this.folderService.deleteFolder(item._id);
        this.updateList();
        Swal.fire(
          'Deleted!',
          'The folder has been deleted.',
          'success'
        );
      }
    });
  }

  deleteFolderRecursive(path) {
    const fs = require('fs');
    const Path = require('path');
    if (fs.existsSync(path)) {
      fs.readdirSync(path).forEach((file, index) => {
        const curPath = Path.join(path, file);
        if (fs.lstatSync(curPath).isDirectory()) { // recurse
          this.deleteFolderRecursive(curPath);
        } else { // delete file
          fs.unlinkSync(curPath);
        }
      });
      fs.rmdirSync(path);
    }
  };

  goPhoto(f) {
    this.router.navigate(['/capture', f._id]);
  }

  openLink() {
    const shell = require('electron').shell;
    shell.openExternal(`https://youtu.be/LGKteLpCtZw`);
  }

}
