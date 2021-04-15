import 'rxjs/add/operator/take';

import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { tap, map, take } from 'rxjs/operators';
import { HomeService } from '../../core/services/home/home.service';


@Injectable({
  providedIn: 'root'
})
export class RequireAuthGuard implements CanActivate {
  constructor(private auth: HomeService, private router: Router) {}

  canActivate(): Observable<boolean> {

    return this.auth.user$.pipe(
      take(1),
      map(user => user && this.auth.canRead(user) ? true : false),
      tap(canView => {
        if (!canView) {
          this.router.navigate(['/']);
          console.error('Access denied. Must have permission to view content');
        }
      })
    );
  }
}
