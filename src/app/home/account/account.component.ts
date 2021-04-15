import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import * as _ from "underscore";
import Swal from "sweetalert2";
import { UserService } from "../../core/services/user/user.service";
import { ElectronService } from "../../core/services";

@Component({
  selector: "app-account",
  templateUrl: "./account.component.html",
  styleUrls: ["./account.component.scss"],
})
export class AccountComponent implements OnInit {
  collectionUsers;
  checkBoxValue: boolean;
  public accountForm: FormGroup;
  constructor(
    public router: Router,
    public formBuilder: FormBuilder,
    public userService: UserService,
    private electronService: ElectronService
  ) {}

  ngOnInit(): any {
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
      project: ["", [Validators.required]],
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required]],
    });
  }

  postSignIn(): void {
    this.router.navigate([""]);
  }

  async onRegister() {
    const bcrypt = require("bcryptjs");
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(this.accountForm.value.password, salt);
    const existUser = await this.userService.findUser(
      this.accountForm.value.dni
    );
    if (existUser) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "This user has already been registered!",
      });
      this.accountForm.reset();
    } else {
      const user: any = {
        project: this.accountForm.value.project,
        nickname: this.accountForm.value.displayName,
        dni: this.accountForm.value.dni,
        uid: this.accountForm.value.project + "_" + this.accountForm.value.dni,
        email: this.accountForm.value.email,
        password: hash,
        proyectos: [],
        roles: {
          subscriber: false,
          editor: false,
          admin: false,
        },
      };
      await this.userService.createUser(user);
      this.accountForm.reset();
      this.postSignIn();
    }
  }

  async hashPassword(password) {
    const bcrypt = require("bcryptjs");
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash.toString();
  }

  actualizarUsuario(): any {
    if (!this.electronService.fs.existsSync('M://Configuracion/usuarios.json')) {
      Swal.fire({
        icon: 'info',
        title: 'Advertencia',
        text: 'No se encuentra el archivo usuarios.json',
      });
      return;

    } else {
      const fecha = Date.now();
      const exec = require("child_process").exec;
      const command = "mongoimport -d sindex -c users --file M://Configuracion/usuarios.json";
      exec(command, (err, stdout, stderr) => {
        if (err) {
          console.log(err);
          return;
        }
        const fs = require("fs");
        fs.rename("M://Configuracion/usuarios.json", `M://Configuracion/usuarios_${fecha}.json`, function (err) {
          if (err) console.log("ERROR: " + err);
        });
      });
    }
  }
}
