import { Meta, Title } from "@angular/platform-browser";
import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
} from "@angular/core";
import { Router } from "@angular/router";
import { HomeService } from "../core/services/home/home.service";
import { Observable, of } from "rxjs";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
declare const $;
import Swal from "sweetalert2";
import { ElectronService } from "../core/services";
import { RecordService } from "../core/services/record/record.service";
import { UserService } from "../core/services/user/user.service";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
  @ViewChild("inputEl") inputEl: ElementRef;
  user;
  records;
  data;
  currentDate: any;
  ocultar: boolean;
  projects: Observable<any>;
  view: any;
  miError: boolean;
  public loginForm: FormGroup;
  constructor(
    public meta: Meta,
    public title: Title,
    public auth: HomeService,
    public userService: UserService,
    public router: Router,
    public formBuilder: FormBuilder,
    public recordService: RecordService,
    public electronService: ElectronService
  ) {
    this.view = [innerWidth / 1.6, innerHeight / 1.6];
    this.currentDate = new Date();
    this.meta.updateTag({ name: "description", content: "Sign In" });
    this.title.setTitle("MAGNUM(local)");
    this.ocultar = true;
    this.loginForm = this.formBuilder.group({
      dni: ["", [Validators.required]],
    });
  }

  ngOnInit(): any {

  }

  postSignIn(): any {
    this.router.navigate(["/Home"]);
  }

  async onLogin(): Promise<any> {
    if (
      !this.electronService.fs.existsSync(
        `M://Configuracion/usuario_${this.loginForm.value.dni}.json`
      ) &&
      !this.electronService.fs.existsSync(
        `M://Configuracion/proyectos_${this.loginForm.value.dni}.json`
      ) &&
      !this.electronService.fs.existsSync(
        `M://Configuracion/documentos_${this.loginForm.value.dni}.json`
      ) &&
      !this.electronService.fs.existsSync(
        `M://Configuracion/plantillas_${this.loginForm.value.dni}.json`
      )
    ) {
      Swal.fire({
        icon: "info",
        title: "Advertencia",
        text: "Este usuario no ha sido registrado",
      });
      return;
    } else {
      const user = await this.userService.findUsuario(this.loginForm.value.dni);
      if (user) {
        this.auth.authenticated$ = of(true);
        this.auth.user$ = of(user);
        localStorage.setItem("user", JSON.stringify(user));
        this.redirectUser();
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Este usuario no ha sido registrado!",
        });
      }
    }
  }

  private redirectUser(): void {
    this.router.navigate(["/detail"]);
  }

  actualizarUsuario(): any {
    if (
      !this.electronService.fs.existsSync(
        `M://Configuracion/usuario_${this.loginForm.value.dni}.json`
      ) &&
      !this.electronService.fs.existsSync(
        `M://Configuracion/proyectos_${this.loginForm.value.dni}.json`
      ) &&
      !this.electronService.fs.existsSync(
        `M://Configuracion/documentos_${this.loginForm.value.dni}.json`
      ) &&
      !this.electronService.fs.existsSync(
        `M://Configuracion/plantillas_${this.loginForm.value.dni}.json`
      )
    ) {
      Swal.fire({
        icon: "info",
        title: "Advertencia",
        text: "No se encuentran los archivos de configuración",
      });
      return;
    } else {
      try {
        const exec = require("child_process").exec;
        const execP = require("child_process").exec;
        const execD = require("child_process").exec;
        const execPl = require("child_process").exec;
        const commandUser = `mongoimport -d sindex -c miusuario --mode=upsert --file M://Configuracion/usuario_${this.loginForm.value.dni}.json`;
        const commandProyecto = `mongoimport -d sindex -c miproyecto --mode=upsert --file M://Configuracion/proyectos_${this.loginForm.value.dni}.json`;
        const commandDocumento = `mongoimport -d sindex -c midocumento --mode=upsert --file M://Configuracion/documentos_${this.loginForm.value.dni}.json`;
        const commandPlantilla = `mongoimport -d sindex -c miplantilla --mode=upsert --file M://Configuracion/plantillas_${this.loginForm.value.dni}.json`;
        exec(commandUser, (err) => {
          if (err) {
            console.log(err);
            return;
          }
        });
        execP(commandProyecto, (err) => {
          if (err) {
            console.log(err);
            return;
          }
        });
        execD(commandDocumento, (err) => {
          if (err) {
            console.log(err);
            return;
          }
        });
        execPl(commandPlantilla, (err) => {
          if (err) {
            console.log(err);
            return;
          }
        });
        Swal.fire({
          icon: "success",
          title: "Mensaje",
          text: "La Base de datos ha sido actualizada!",
        });
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: `${error}`,
        });
      }
    }
  }
}
