import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ProyectoService } from "../core/services/proyecto/proyecto.service";
import { SettingsService } from "../core/services/settings/settings.service";
declare const jQuery: any;
import Swal from "sweetalert2";
declare const $;

@Component({
  selector: "app-configuracion",
  templateUrl: "./configuracion.component.html",
  styleUrls: ["./configuracion.component.scss"],
})
export class ConfiguracionComponent implements OnInit {
  @ViewChild("myModal") myModal: ElementRef;
  redirect_uri = "https://developers.google.com/oauthplayground";
  setting;
  updateData: any = {};
  proyectos;
  proyecto;
  crear = true;
  public settingForm: FormGroup;
  constructor(
    public settingsService: SettingsService,
    public formBuilder: FormBuilder,
    public proyectoService: ProyectoService
  ) {
    this.settingForm = this.formBuilder.group({
      client_id: ["", [Validators.required]],
      client_secret: ["", [Validators.required]],
      refresh_token: ["", [Validators.required]],
      connectionString: ["", [Validators.required]]
    });
  }

  async ngOnInit(): Promise<any> {
    this.proyectos = await this.proyectoService.loadmiProyecto();
  }

  async actualizarData(): Promise<any> {
    await this.settingsService.updateConfig(this.setting._id,this.updateData);
    this.setting = await this.settingsService.loadSettingbyID({
      proyectoId: this.proyecto._id,
    });
    jQuery(this.myModal.nativeElement).modal("hide");
  }

  async registrarData(): Promise<any> {
    this.settingForm.value.redirect_uri = this.redirect_uri;
    this.settingForm.value.proyectoId = this.proyecto._id;
    await this.settingsService.createSetting(this.settingForm.value);
    jQuery(this.myModal.nativeElement).modal("hide");
  }

  async showModal(): Promise<any> {
    if (this.proyecto) {
      this.updateData = await this.settingsService.loadSettingbyID({
        proyectoId: this.proyecto._id,
      });
      jQuery(this.myModal.nativeElement).modal("show");
    } else {
      Swal.fire({
        icon: "info",
        title: "Oops...",
        text: "Elija un proyecto para iniciar el registro!",
      });
    }
  }

  async onChange(p): Promise<any> {
    this.setting = null;
    this.updateData =  {};
    const temp = await this.settingsService.loadSettingbyID({
      proyectoId: p._id,
    });
    this.setting = temp;
    if(this.setting){
      this.crear = false;
    }else {
      this.crear = true;
    }
  }
}
