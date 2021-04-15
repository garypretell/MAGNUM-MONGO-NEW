import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { map, switchMap, takeUntil } from "rxjs/operators";
import Swal from "sweetalert2";
import * as _ from "underscore";
import { DocumentService } from "../core/services/document/document.service";
import { ProyectoService } from "../core/services/proyecto/proyecto.service";
import { UserService } from "../core/services/user/user.service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
declare var jQuery: any;
declare const $;

@Component({
  selector: "app-usuario",
  templateUrl: "./usuario.component.html",
  styleUrls: ["./usuario.component.scss"],
})
export class UsuarioComponent implements OnInit {
  users;
  user;
  @ViewChild("editModal") editModal: ElementRef;
  @ViewChild("nuevoUser") nuevoUser: ElementRef;
  usuariotoEdit: any = {};
  subscriber: any;
  editor: any;
  admin: any;
  super: any;
  miproyecto: any;
  dni: any;
  misede: any;
  arrayTemp: any;
  idx: any;
  campotoEditS: any = {};
  searchObject: any = {};
  public accountForm: FormGroup;
  constructor(
    public router: Router,
    public activatedroute: ActivatedRoute,
    public userService: UserService,
    public documentoService: DocumentService,
    public proyectoService: ProyectoService,
    public formBuilder: FormBuilder
  ) {
    this.accountForm = this.formBuilder.group({
      displayName: ["", [Validators.required]],
      dni: [
        "",
        [
          Validators.required,
          Validators.min(10000000),
          Validators.max(99999999),
        ],
      ],
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required]],
    });
  }

  async ngOnInit(): Promise<any> {
    this.user = JSON.parse(localStorage.getItem("user"));
    this.dni = this.user.dni;
    this.users = await this.userService.loadUsers();
  }

  deleteUsusario(usuario): any {
    Swal.fire({
      title: "Esta seguro de eliminar este usuario?",
      text: "No podrás revertir este proceso!",
      icon: "warning",
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, Eliminar!",
    }).then(async (result) => {
      if (result.value) {
        await this.userService.deleteUser(usuario._id);
        Swal.fire("Eliminado!", "El usuario ha sido eliminado.", "success");
        this.users = await this.userService.loadUsers();
      }
    });
  }

  editUsuario(usuario) {
    this.idx = usuario._id;
    this.subscriber = usuario.roles.subscriber;
    this.editor = usuario.roles.editor;
    this.admin = usuario.roles.admin;
    this.super = usuario.roles.super;
    jQuery(this.editModal.nativeElement).modal("show");
  }

  async updateUsuario(): Promise<any> {
    const roles: any = {
      roles: {
        admin: this.admin,
        editor: this.editor,
        subscriber: this.subscriber,
        super: this.super,
      },
    };
    await this.userService.updateUser(this.idx, roles);
    jQuery(this.editModal.nativeElement).modal("hide");
    this.users = await this.userService.loadUsers();
  }

  goReporte(usuario): any {
    this.router.navigate(["user", usuario.uid, "report"]);
  }

  async exportUsuario(dni: number): Promise<any> {
    try {
      const exec = require("child_process").exec;
      const command = `mongoexport --host localhost --port 27017 --db sindex -c users --query "{\\"dni\\": ${dni}}" --type json --out M://Configuracion/usuario_${dni}.json`;
      exec(command, (err) => {
        if (err) {
          console.log(err);
          return;
        }
        Swal.fire("Exportado!", "Los archivos han sido creados.", "success");
      });
    } catch (error) {
      console.log(error);
    }
  }

  nuevoUsaurio() {
    jQuery(this.nuevoUser.nativeElement).modal("show");
  }

  async exportProyecto(dni: number): Promise<any> {
    try {
      const exec = require("child_process").exec;
      const command = `mongoexport --host localhost --port 27017 --db sindex -c proyectos --query "{\\"users\\": {\\"$elemMatch\\": {\\"dni\\":${dni}}}}" --type json --out M://Configuracion/proyectos_${dni}.json`;
      exec(command, (err) => {
        if (err) {
          console.log(err);
          return;
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  async exportDocumento(array, dni: number): Promise<any> {
    let temp = ``;
    array.forEach((element) => {
      temp += `\\"` + element + `\\"` + `,`;
    });
    temp = temp.slice(0, -1);
    try {
      const exec = require("child_process").exec;
      const command = `mongoexport --host localhost --port 27017 --db sindex -c documento --query "{\\"proyecto\\": {\\"$in\\": [${temp}]}}" --type json --out M://Configuracion/documentos_${dni}.json`;
      exec(command, (err) => {
        if (err) {
          console.log(err);
          return;
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  async exportPlantilla(array, dni: number): Promise<any> {
    let temp = ``;
    array.forEach((element) => {
      temp += `\\"` + element + `\\"` + `,`;
    });
    temp = temp.slice(0, -1);
    try {
      const exec = require("child_process").exec;
      const command = `mongoexport --host localhost --port 27017 --db sindex -c plantilla --query "{\\"documento\\": {\\"$in\\": [${temp}]}}" --type json --out M://Configuracion/plantillas_${dni}.json`;
      exec(command, (err) => {
        if (err) {
          console.log(err);
          return;
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  async exportFiles(dni: number): Promise<any> {
    this.exportUsuario(dni);
    this.exportProyecto(dni);
    const proyectos = await this.proyectoService.proyectoExport(dni);
    const result = proyectos.map(({ _id }) => _id.toString());
    const documentos = await this.documentoService.documentoExport(result);
    const result2 = documentos.map(({ _id }) => _id);
    this.exportDocumento(result, dni);
    this.exportPlantilla(result2, dni);
  }

  async onRegister() {
    const bcrypt = require('bcryptjs');
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(this.accountForm.value.password, salt);
    var existUser = await this.userService.findUser(this.accountForm.value.dni);
    if (existUser) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'This user has already been registered!'
      });
      this.accountForm.reset();
    } else {
      var user: any = {
        nickname: this.accountForm.value.displayName,
        dni: this.accountForm.value.dni,
        uid: this.accountForm.value.project + '_' + this.accountForm.value.dni,
        email: this.accountForm.value.email,
        password: hash,
        roles: {
          subscriber: false,
          editor: false,
          admin: false
        }
      }
      await this.userService.createUser(user);
      this.accountForm.reset();
      this.users = await this.userService.loadUsers();
      // jQuery(this.nuevoUser.nativeElement).modal("hide");
    }

  }

  async hashPassword(password) {
    const bcrypt = require('bcryptjs');
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash.toString();
  }
}
