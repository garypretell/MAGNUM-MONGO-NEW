import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { ProyectoService } from "../core/services/proyecto/proyecto.service";
import { UserService } from "../core/services/user/user.service";
import { DragulaService } from "ng2-dragula";
import Swal from "sweetalert2";
import { Subscription } from "rxjs";
declare var jQuery: any;
declare const $;
@Component({
  selector: "app-proyecto",
  templateUrl: "./proyecto.component.html",
  styleUrls: ["./proyecto.component.scss"],
})
export class ProyectoComponent implements OnInit {
  @ViewChild("editProject") editProject: ElementRef;
  @ViewChild("addProject") addProject: ElementRef;
  @ViewChild("addUser") addUser: ElementRef;
  @ViewChild("inputEl") inputEl: ElementRef;
  public addProyectoForm: FormGroup;
  proyectoList;
  proyecto: any;
  proyectoEdit: any = {};
  userRight: any = [];
  userLeft: any = [];
  p = 1;
  VAMPIRES = "VAMPIRES";
  MANY_ITEMS = "MANY_ITEMS";
  BAG = "DRAGULA_EVENTS";
  subs = new Subscription();
  constructor(
    public formBuilder: FormBuilder,
    public proyectoService: ProyectoService,
    public userService: UserService,
    public router: Router,
    private dragulaService: DragulaService
  ) {
    this.subs.add(
      dragulaService.dropModel(this.MANY_ITEMS).subscribe(async (args) => {
        if (args.el.className === "vamp gu-transit") {
          await this.proyectoService.updateProyectoUsuarios(
            this.proyecto.codigo,
            { users: args.sourceModel }
          );
        } else {
          await this.proyectoService.updateProyectoUsuarios(
            this.proyecto.codigo,
            { users: args.targetModel }
          );
        }
      })
    );

    this.addProyectoForm = this.formBuilder.group({
      nombre: ["", [Validators.required]],
    });
  }

  async ngOnInit(): Promise<void> {
    this.proyectoList = await this.proyectoService.loadProyecto();
  }

  ngOnDestroy(): any {
    this.subs.unsubscribe();
  }

  addModal(): any {
    jQuery(this.addProject.nativeElement).modal("show");
    setTimeout(() => this.inputEl.nativeElement.focus(), 500);
  }

  async userModal(item: any): Promise<any> {
    this.proyecto = await this.proyectoService.findProyecto(item._id);
    this.proyectoEdit = await this.proyectoService.findProyecto(item._id);
    const usuarios = await this.userService.loadUsuarios();
    this.userRight = this.proyecto.users;
    this.userLeft = this.arrL(usuarios, this.userRight);
    jQuery(this.addUser.nativeElement).modal("show");
  }

  arrL(users: any[], arrR: any[]): any[] {
    const array = [];
    for (let i = 0; i < users.length; i++) {
      let igual = false;
      for (let j = 0; j < arrR.length && !igual; j++) {
        if (users[i]["dni"] == arrR[j]["dni"]) igual = true;
      }
      if (!igual) array.push(users[i]);
    }
    return array;
  }

  async editModal(p): Promise<any> {
    this.proyectoEdit = await this.proyectoService.findProyecto(p._id);
    jQuery(this.editProject.nativeElement).modal("show");
  }

  async addProyecto(): Promise<void> {
    const proyecto: any = {
      codigo: this.addProyectoForm.value.nombre.replace(/ /g, ""),
      nombre: this.addProyectoForm.value.nombre,
      estado: true,
      users: [],
    };
    await this.proyectoService.createProyecto(proyecto).then((result: any) => {
      this.proyectoList.push(result.ops[0]);
    });
    this.addProyectoForm.reset();
    setTimeout(() => this.inputEl.nativeElement.focus(), 500);
  }

  deleteProyecto(p): any {
    Swal.fire({
      title: "Esta seguro de eliminar este Proyecto?",
      text: "No podrás revertir este proceso!",
      icon: "warning",
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, Eliminar!",
    }).then(async (result) => {
      if (result.value) {
        const index = this.proyectoList.findIndex((i) => i.codigo === p.codigo);
        this.proyectoList.splice(index, 1);
        await this.proyectoService.deleteProyecto(p._id);
        Swal.fire("Eliminado!", "El proyecto ha sido eliminado.", "success");
      }
    });

    // this.proyectoList[index].estado = false;
  }

  async updateProyecto(p): Promise<any> {
    const index = this.proyectoList.findIndex((i) => i.codigo === p.codigo);
    this.proyectoList[index] = this.proyectoEdit;
    await this.proyectoService.updateProyecto(p._id, this.proyectoEdit);
    jQuery(this.editProject.nativeElement).modal("hide");
  }

  getColor(estado): any {
    switch (estado) {
      case true:
        return "black";
      case false:
        return "red";
    }
  }

  goProyectoDocumento(p): any {
    this.router.navigate(["/proyecto", p._id.toString()]);
  }
}
