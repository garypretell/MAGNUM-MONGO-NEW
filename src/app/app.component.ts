import { Component, OnDestroy, OnInit } from '@angular/core';
import { HomeService } from './core/services/home/home.service';
import { ElectronService } from "./core/services";
import { TranslateService } from "@ngx-translate/core";
import { AppConfig } from "../environments/environment";
import { UserService } from './core/services/user/user.service';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  user;
  rows: any;
  constructor(
    public auth: HomeService,
    public router: Router,
    public userService: UserService,
    public electronService: ElectronService
  ) {

  }
  ngOnInit() {
    if (!this.electronService.fs.existsSync('M://MagnumDB')) {
      let timerInterval;
      Swal.fire({
        title: 'Database is not found!',
        html: 'I will close in <b></b> milliseconds.',
        timer: 4000,
        timerProgressBar: true,
        willOpen: () => {
          Swal.showLoading()
          timerInterval = setInterval(() => {
            const content = Swal.getContent();
            if (content) {
              const b: any = content.querySelector('b');
              if (b) {
                b.textContent = Swal.getTimerLeft();
              }
            }
          }, 100)
        },
        willClose: () => {
          clearInterval(timerInterval);
          window.close();
        }
      }).then((result) => {
        /* Read more about handling dismissals below */
        if (result.dismiss === Swal.DismissReason.timer) {
          console.log('I was closed by the timer')
        }
        window.close();
      })
      // window.close();
    }
    this.auth.user$ = of(JSON.parse(localStorage.getItem('user')));
  }
}
