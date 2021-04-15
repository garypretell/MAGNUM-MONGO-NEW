import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { tap, map, take } from 'rxjs/operators';
import { HomeService } from '../../core/services/home/home.service';

@Injectable({
  providedIn: 'root'
})
export class SuperGuard implements CanActivate {

  constructor(private auth: HomeService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.auth.user$.pipe(
      take(1),
      map(user => user && user.roles.super ? true : false),
      tap(isSuper => {
        if (!isSuper) {
          this.router.navigate(['/home']);
          console.error('Access denied - SuperAdmins only');
        }
      })
    );
  }
}
