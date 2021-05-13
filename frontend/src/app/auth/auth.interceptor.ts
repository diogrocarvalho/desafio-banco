import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private router: Router, private authService: AuthService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        request = request.clone({
          setHeaders: {
            Authorization: `Bearer ${AuthService.getToken()}`
          }
        });

        return next.handle(request).pipe(catchError((error: HttpErrorResponse) => {

            if (error.status === 401 || error.status === 403) {
                this.router.navigate(['login']);
            }

            throw error;
        }));
    }

}
