import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { User } from './user.model';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { UserService } from './user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { SnackService } from '../../../shared/snack/snack-service';


@Injectable({ providedIn: 'root'})
export class UserResolver implements Resolve<User> {

    constructor(private userService: UserService,
                private snackService: SnackService,
                private router: Router) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<User> | Promise<User> | User {

        const user$: Subject<User> = new Subject();

        this.userService.get(Number(route.paramMap.get('id'))).subscribe((user: User) => {
            user$.next(user);
            user$.complete();
        }, (error: HttpErrorResponse) => {
            user$.error(error);
            this.router.navigate(['/users']).then(() => {
                this.snackService.showError(error);
            });
        });

        return user$;
    }

}
