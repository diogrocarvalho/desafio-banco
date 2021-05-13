import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';


@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {

    constructor(private authService: AuthService,
                private router: Router) { }


    canActivate(route: ActivatedRouteSnapshot,
                state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

        const expectedRole = route.data.expectedRole;

        if (!this.authService.is(expectedRole)) {
            this.router.navigate(['login']).then();
            return false;
        }

        return true;
    }

}
