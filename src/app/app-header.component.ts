import {
  Component,
  OnInit,
  OnDestroy,
  ElementRef,
  ViewChild,
  AfterViewInit,
} from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import {
  Observable,
  Subject,
  of,
  fromEvent,
  merge,
  from,
  Observer,
} from "rxjs";
import { ProyectoService } from "./core/services/proyecto/proyecto.service";
import { HomeService } from "./core/services/home/home.service";
import { RecordService } from "./core/services/record/record.service";
import { ImageService } from "./core/services/images/images.service";
import { FolderService } from "./core/services/folder/folder.service";
import { SettingsService } from "./core/services/settings/settings.service";
import { ElectronService } from "./core/services";
import { HostListener } from "@angular/core";
import Swal from "sweetalert2";
import { map, takeUntil } from "rxjs/operators";
const ObjectID = require("mongodb").ObjectID;

@Component({
  selector: "app-header",
  templateUrl: "app-header.component.html",
  styleUrls: ["./app-header.component.scss"],
})
export class AppHeaderComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject();
  @ViewChild("myModal") myModal: ElementRef;
  elementos: any[] = [];
  currentChoice: string;
  name: any;
  codigo: any;
  message;
  mensaje: any;
  transferencia: any;
  super: boolean;
  sede: any;
  misede: any;
  miproyecto: any;
  foto: any;
  documentos$: Observable<any>;
  directorio$: Observable<any>;
  user;
  contador: any;
  proyecto: any;
  activeTab = "home";
  activeTab2 = "envio";
  interval;
  timer = 0;
  conexion: boolean;
  envioList = [];
  historialList: any = [];
  selectedTopics: any[] = [];
  selectedTopicsH: any[] = [];
  progreso = 0;
  setting;
  activo = false;
  activoH = false;

  UserDictation;
  text = [];

  proyectos;
  proyectoW;
  public valorEmitido = this.recordService.recibir;
  public valorEmitidoP = this.proyectoService.recibir;
  constructor(
    public auth: HomeService,
    public proyectoService: ProyectoService,
    public recordService: RecordService,
    public imageService: ImageService,
    public router: Router,
    public route: ActivatedRoute,

    public folderService: FolderService,
    private electronService: ElectronService,
    public settingsService: SettingsService
  ) {
    this.super = true;
  }

  // @HostListener("window:beforeunload", ["$event"])
  // onWindowClose(event: any): void {
  //   // Do something
  //   Swal.fire({
  //     icon: 'info',
  //     title: 'Oops...',
  //     text: 'You need to configure your computer, contact the administrator',
  //   });
  //   event.preventDefault();
  //   event.returnValue = false;
  // }

  createOnline$(): any {
    return merge<boolean>(
      fromEvent(window, "offline").pipe(map(() => false)),
      fromEvent(window, "online").pipe(map(() => true)),
      new Observable((sub: Observer<boolean>) => {
        sub.next(navigator.onLine);
        sub.complete();
      })
    );
  }

  async ngOnInit(): Promise<any> {
    this.proyectos = await this.proyectoService.loadmiProyecto();
    this.createOnline$().subscribe((isOnline) => (this.conexion = isOnline));
    this.user = JSON.parse(localStorage.getItem("user"));
    this.auth.user$ = of(JSON.parse(localStorage.getItem("user")));
    this.contador = await this.recordService.countRecords();
    this.recordService.enviar(this.contador);
    this.valorEmitidoP
      .pipe(
        map((p) => {
          this.proyecto = p;
        }),
        takeUntil(this.unsubscribe$)
      )
      .subscribe();
  }

  async updateTables(): Promise<any> {
    this.activo = false;
    this.activoH = false;
    this.selectedTopics = [];
    this.selectedTopicsH = [];
    this.envioList = await this.folderService.findFolder({
      status: "COMPLETE",
      proyectoid: this.proyectoW._id.toString(),
      percent: { $lt: 100 },
    });
    this.historialList = await this.folderService.findFolder({
      status: "COMPLETE",
      proyectoid: this.proyectoW._id.toString(),
      complete: false,
      percent: { $gte: 100 },
    });
    this.setting = await this.settingsService.loadSettingbyID({
      proyectoId: this.proyectoW._id,
    });
  }

  ngOnDestroy(): any {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  goAreas(): any {
    this.search("home");
    this.router.navigate(["/area"]);
  }

  goProyectos(): any {
    this.search("home");
    this.router.navigate(["/proyecto"]);
  }

  goDetail(): void {
    this.search("home");
    this.router.navigate(["/detail"]);
  }
  goConfiguracion(): any {
    this.search("home");
    this.router.navigate(["/configuracion"]);
  }

  signOut(): any {
    localStorage.removeItem("user");
    localStorage.clear();
    this.user = null;
    this.auth.user$ = null;
    this.auth.authenticated$ = of(false);
    this.router.navigate(["/"]);
  }

  limpiar(): any {}

  goDocumento(): any {}

  goUsuarios(): any {
    this.search("home");
    this.router.navigate(["/user"]);
  }

  listado(): any {
    // jQuery(this.myModal.nativeElement).modal('show');
  }

  goReporte(): any {
    this.search("home");
    this.router.navigate(["/user", this.user.uid, "report"]);
  }

  goAvatar(): any {
    this.search("home");
    this.router.navigate(["/user", this.user.uid]);
  }

  exportData(): any {
    this.valorEmitidoP
      .pipe(
        map((p) => {
          this.proyectoW = p;
        }),
        
        takeUntil(this.unsubscribe$)
      )
      .subscribe();
    try {
      const exec = require("child_process").exec;
      const command = `mongoexport --host localhost --port 27017 --db sindex -c records --query "{\\"proyectoid\\": \\"${this.proyectoW._id.toString()}\\"}" --type json --out M://Configuracion/proyecto_${
        this.proyectoW.codigo
      }.json`;
      exec(command, (err) => {
        if (err) {
          console.log(err);
          return;
        }
        Swal.fire({
          icon: "success",
          title: "Exportar Data",
          text: "Los archivos han sido creados!",
        });
      });
    } catch (error) {
      console.log(error);
    }
  }

  importData(): any {
    this.valorEmitidoP
      .pipe(
        map((p) => {
          this.proyectoW = p;
        }),
        takeUntil(this.unsubscribe$)
      )
      .subscribe();
    if (
      !this.electronService.fs.existsSync(
        `M://Configuracion/proyecto_${this.proyectoW.codigo}.json`
      )
    ) {
      Swal.fire({
        icon: "info",
        title: "Advertencia",
        text: "No se encuentra el archivo requerido",
      });
      return;
    } else {
      const fecha = Date.now();
      const exec = require("child_process").exec;
      const command = `mongoimport -d sindex -c records --file M://Configuracion/proyectos_44444444.json`;
      exec(command, (err, stdout, stderr) => {
        if (err) {
          console.log(err);
          return;
        }
        Swal.fire({
          icon: "info",
          title: "Mensaje",
          text: "La base de datos ha sido actualizada!",
        });
        const fs = require("fs");
        fs.rename(
          `M://Configuracion/proyecto_${this.proyectoW.codigo}.json`,
          `M://Configuracion/proyecto_${this.proyectoW.codigo}_${fecha}.json`,
          function (err) {
            if (err) console.log("ERROR: " + err);
          }
        );
      });
    }
  }

  search(activeTab): void {
    this.activeTab = activeTab;
  }

  async result(activeTab): Promise<any> {
    this.activeTab = activeTab;
  }

  envio(activeTab): void {
    this.activeTab2 = activeTab;
  }

  historial(activeTab): void {
    this.activeTab2 = activeTab;
  }

  startTimer(): void {
    this.interval = setInterval(() => {
      this.timer++;
    }, 1000);
  }

  pauseTimer(): void {
    clearInterval(this.interval);
  }

  isSelected(value: string): boolean {
    return this.selectedTopics.indexOf(value) >= 0;
  }

  isSelectedH(value: string): boolean {
    return this.selectedTopicsH.indexOf(value) >= 0;
  }

  onChange(value: string, checked: boolean): any {
    if (checked) {
      this.selectedTopics.push(value);
    } else {
      let index = this.selectedTopics.indexOf(value);
      this.selectedTopics.splice(index, 1);
    }
  }

  onChangeH(value: string, checked: boolean): any {
    if (checked) {
      this.selectedTopicsH.push(value);
    } else {
      let index = this.selectedTopicsH.indexOf(value);
      this.selectedTopicsH.splice(index, 1);
    }
  }

  async transmitir(): Promise<any> {
    if (this.selectedTopics.length > 0) {
      this.activo = true;
      const carpetas = this.selectedTopics.filter((f) => f.percent < 100);
      await carpetas.reduce(async (promise, m) => {
        await promise;
        const temp = await this.imageService.findImages({
          idFolder: m._id.toString(),
        });
        const filtro = temp.filter((f) => f.drive === null);
        await filtro.reduce(async (promise2, t) => {
          await promise2;
          await this.uploadFile(t._id.toString(), t.pathname).then(async () => {
            m.percent += 100 / temp.length;
            await this.folderService.updateFolder(m._id, {
              percent: m.percent,
            });
          });
        }, Promise.resolve());
        await this.exportDataWeb(m);
      }, Promise.resolve());
      this.updateTables();
    } else {
      Swal.fire({
        icon: "info",
        title: "Oops...",
        text: "Elija una carpeta de la lista",
      });
    }
  }

  async uploadFile(name: string, pathname: string): Promise<any> {
    if (this.setting) {
      const fs = require("fs");
      const CLIENT_ID = this.setting.client_id.toString();
      // "413332879385-m3778r3157f2b2sv51cojf4e3b32oogg.apps.googleusercontent.com";
      const CLIENT_SECRET = this.setting.client_secret.toString();
      // "ENTZwBndKEasjotDToaazhkE";
      const REFRESH_TOKEN = this.setting.refresh_token.toString();
      // "1//04yp5MYHXBhcaCgYIARAAGAQSNwF-L9IrQ2VzJj-Z8eTk922ewIMRJXQMgSds12lRnZYL4JYKUBV5GlzlMWtsb2EXO6zK5igN72c";
      try {
        await fetch("https://accounts.google.com/o/oauth2/token", {
          method: "POST",
          body: JSON.stringify({
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            refresh_token: REFRESH_TOKEN,
            grant_type: "refresh_token",
          }),
        })
          .then((res) => {
            return res.json();
          })
          .then(async (val) => {
            const buffer = fs.readFileSync(pathname);
            const img = new Blob([buffer], { type: "image/jpeg" });
            const fileMetadata = { name: name }; // Please set filename.
            const form = new FormData();
            form.append(
              "metadata",
              new Blob([JSON.stringify(fileMetadata)], {
                type: "application/json",
              })
            );
            form.append("file", img);
            await fetch(
              "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart",
              {
                method: "POST",
                headers: new Headers({
                  Authorization: "Bearer " + val.access_token.toString(),
                }),
                body: form,
              }
            )
              .then((res) => res.json())
              .then(async (res) => {
                const idImage = res.id.toString();
                await fetch(
                  `https://www.googleapis.com/drive/v3/files/${idImage}/permissions`,
                  {
                    method: "POST",
                    headers: new Headers({
                      Authorization: "Bearer " + val.access_token.toString(),
                      Accept: "application/json",
                      "Content-Type": "application/json",
                    }),
                    body: JSON.stringify({ role: "reader", type: "anyone" }),
                  }
                );
                await fetch(
                  `https://www.googleapis.com/drive/v3/files/${idImage}?fields=webViewLink,webContentLink,id,name`,
                  {
                    method: "GET",
                    headers: new Headers({
                      Authorization: "Bearer " + val.access_token.toString(),
                    }),
                  }
                )
                  .then((res) => res.json())
                  .then(async (res) => {
                    await this.imageService.updateImage(
                      new ObjectID(res.name),
                      {
                        drive: res.id,
                        webContentLink: res.webContentLink,
                        webViewLink: res.webViewLink,
                      }
                    );
                    await this.recordService.updateRecordManage(
                      { path: pathname },
                      {
                        drive: res.id,
                        webContentLink: res.webContentLink,
                        webViewLink: res.webViewLink,
                      }
                    );
                  });
              });
          });
      } catch (error) {
        console.log(error.message);
      }
    } else {
      Swal.fire({
        icon: "info",
        title: "Advertencia",
        text: "Las llaves de acceso no han sido registradas!",
      });
      return;
    }
  }

  async importDataWeb(p): Promise<any> {
    if (this.setting) {
      const url = this.setting.connectionString.toString();
      if (
        !this.electronService.fs.existsSync(
          `M://Reportes/${p._id.toString()}.json`
        )
      ) {
        Swal.fire({
          icon: "info",
          title: "Advertencia",
          text: "No se encuentra el archivo requerido",
        });
        return;
      } else {
        const exec = require("child_process").exec;
        const command = `mongoimport --uri ${url} --collection records --type json --file M://Reportes/${p._id.toString()}.json`;
        exec(command, (err, stdout, stderr) => {
          if (err) {
            console.log(err);
            return;
          }
        });
      }
    } else {
      Swal.fire({
        icon: "info",
        title: "Advertencia",
        text: "Las llaves de acceso no han sido registradas!",
      });
      return;
    }
  }

  exportDataWeb(p): any {
    try {
      const exec = require("child_process").exec;
      const command = `mongoexport --host localhost --port 27017 --db sindex -c records --query "{\\"libro\\": \\"${p._id.toString()}\\"}" --type json --out M://Reportes/${p._id.toString()}.json`;
      exec(command, (err) => {
        if (err) {
          console.log(err);
          return;
        }
        Swal.fire({
          icon: "success",
          title: "Completado!",
          text: "Las imágenes han sido exportadas!",
        });
      });
    } catch (error) {
      console.log(error);
    }
  }

  async transmitirM(): Promise<any> {
    if (this.selectedTopicsH.length > 0) {
      this.activoH = true;
      this.activo = true;
      await this.selectedTopicsH.reduce(async (promise, m) => {
        await promise;
        await this.importDataWeb(m);
        await this.folderService.updateFolder(m._id, { complete: true });
      }, Promise.resolve());
      this.updateTables();
    } else {
      Swal.fire({
        icon: "info",
        title: "Oops...",
        text: "Elija una carpeta de la lista",
      });
    }
  }

  async exportDataMongo(): Promise<any> {
    const p = this.proyectoW;
    try {
      const exec = require("child_process").exec;
      const command = `mongoexport --host localhost --port 27017 --db sindex -c documento --query "{\\"proyecto\\": \\"${p._id.toString()}\\"}" --type json --out M://Configuracion/documentoWeb_${p._id.toString()}.json`;
      const command2 = `mongoexport --host localhost --port 27017 --db sindex -c plantilla --query "{\\"proyecto\\": \\"${p._id.toString()}\\"}" --type json --out M://Configuracion/plantillaWeb_${p._id.toString()}.json`;
      exec(command, (err) => {
        if (err) {
          console.log(err);
          return;
        }
      });
      exec(command2, (err) => {
        if (err) {
          console.log(err);
          return;
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  importDataMongo(): any {
    if (this.setting) {
      const p = this.proyectoW;
      const url = this.setting.connectionString.toString();
      console.log(this.setting);
      if (
        !this.electronService.fs.existsSync(
          `M://Configuracion/documentoWeb_${p._id.toString()}.json`
        ) &&
        !this.electronService.fs.existsSync(
          `M://Configuracion/plantillaWeb_${p._id.toString()}.json`
        )
      ) {
        Swal.fire({
          icon: "info",
          title: "Advertencia",
          text: "No se encuentra el archivo requerido",
        });
        return;
      } else {
        const exec = require("child_process").exec;
        const command = `mongoimport --uri ${url} --collection documento --mode=upsert --type json --file M://Configuracion/documentoWeb_${p._id.toString()}.json`;
        const command2 = `mongoimport --uri ${url} --collection plantilla --mode=upsert --type json --file M://Configuracion/plantillaWeb_${p._id.toString()}.json`;
        exec(command, (err, stdout, stderr) => {
          if (err) {
            console.log(err);
            return;
          }
        });
        exec(command2, (err, stdout, stderr) => {
          if (err) {
            console.log(err);
            return;
          }
        });
      }
    } else {
      Swal.fire({
        icon: "info",
        title: "Advertencia",
        text: "Las llaves de acceso no han sido registradas!",
      });
      return;
    }
  }

  async onChangeW(p): Promise<any> {
    // this.setting = await this.settingsService.loadSettingbyID({
    //   proyectoId: this.proyectoW._id,
    // });
    this.updateTables();
  }
}
