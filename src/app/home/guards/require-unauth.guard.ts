import 'rxjs/add/operator/take';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { map, take, tap } from 'rxjs/operators';
import { HomeService } from '../../core/services/home/home.service';

@Injectable({
  providedIn: 'root'
})
export class RequireUnauthGuard implements CanActivate {
  constructor(private auth: HomeService, private router: Router) { }

  canActivate(): Observable<boolean> {
    return this.auth.authenticated$.pipe(
      take(1),
      tap(authenticated => {
        if (authenticated) {
          this.router.navigate(['/detail']);
        }
      }),
      map(authenticated => !authenticated));
  }
}
