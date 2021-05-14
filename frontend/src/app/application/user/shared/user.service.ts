import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from './user.model';
import { PaginatedService } from '../../../shared/data-source/paginated-service';
import { ConfigService } from '../../../shared/config.service';


@Injectable({
    providedIn: 'root'
})
export class UserService implements PaginatedService<User> {

    apiURL: string;
    resource = 'users';

    constructor(private http: HttpClient, private configService: ConfigService) {
        this.apiURL = this.configService.getSettings().apiURL;

    }

    paginate(params: HttpParams): Observable<HttpResponse<User[]>> {
        return this.http.get<User[]>(
            `${this.apiURL}${this.resource}/`,
            {
                observe: 'response',
                params
            }
        );
    }

    save(user: User): Observable<User> {
        return this.http.post<User>(
            `${this.apiURL}${this.resource}/`,
            user
        );
    }

    get(id: number): Observable<User> {
        return this.http.get<User>(
            `${this.apiURL}${this.resource}/${id}/`,
        );
    }

    update(user: User): Observable<User> {
        return this.http.put<User>(
            `${this.apiURL}${this.resource}/${user.id}/`,
            user
        );
    }

    delete(user: User): Observable<HttpResponse<void>> {
        return this.http.delete<void>(
            `${this.apiURL}${this.resource}/${user.id}/`,
            {
                observe: 'response'
            }
        );
    }

    changePassword(id: number, password: string): Observable<HttpResponse<void>> {
        return this.http.put<void>(
            `${this.apiURL}${this.resource}/${id}/change-password/`,
            { password },
            {
                observe: 'response'
            }
        );
    }

}
