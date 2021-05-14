import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import decode from 'jwt-decode';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { AccessToken } from './acces-token.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Credential} from './credential.model';
import { User } from '../application/user/shared/user.model';
import * as moment from 'moment';
import { ConfigService } from '../shared/config.service';


export const JWT_TOKEN = 'token_test';
const REFRESH_TOKEN_MIN = 3;


@Injectable({ providedIn: 'root' })
export class AuthService {

    constructor(private http: HttpClient,
                private jwtHelperService: JwtHelperService,
                private configService: ConfigService) {
        this.apiURL = this.configService.getSettings().apiURL;
    }


    private authenticated$: Subject<boolean> = new Subject();

    authenticatedUser: BehaviorSubject<User | null> | undefined;
    authenticated: Observable<boolean> = this.authenticated$.asObservable();
    tryingRefresh = false;
    apiURL: string | undefined;

    public static getToken(): string | null {
        return localStorage.getItem(JWT_TOKEN);
    }

    private static claims(): any {
        const token = AuthService.getToken();

        return token ? decode(token) : null;
    }

    public isAuthenticated(): boolean {
        const token = AuthService.getToken();

        if (!token || this.jwtHelperService.isTokenExpired(token)) {
            this.logout();
            this.authenticated$.next(false);
            return false;
        }

        this.getAuthenticatedUser();
        this.authenticated$.next(true);
        return true;
    }

    refreshToken(): void {
        const token = AuthService.getToken();

        if (!token) {
            return;
        }

        const expDate = moment(this.jwtHelperService.getTokenExpirationDate(token));
        const leftTime = moment.duration(expDate.diff(moment()));

        if (!this.tryingRefresh && leftTime.asMinutes() < REFRESH_TOKEN_MIN) {
            this.tryingRefresh = true;
            this.http.get<AccessToken>(
                `${this.apiURL}users/refresh-token`
            ).subscribe((accessToken: AccessToken) => {
                this.tryingRefresh = false;
                this.setAuthenticated(accessToken.accessToken);
            });
        }
    }

    public is(role: string): boolean {
        const payload = AuthService.claims();

        if (payload) {
            return !(!this.isAuthenticated() || payload.role !== role);
        }

        return false;
    }

    public logout(): void {
        localStorage.removeItem(JWT_TOKEN);
        this.getAuthenticatedUser();
    }

    public setAuthenticated(token: string): void {
        localStorage.setItem(JWT_TOKEN, token);
        this.getAuthenticatedUser();
    }

    public getAuthenticatedUser(): Observable<User | null> {
        const payload = AuthService.claims();

        if (payload) {
            const user = new User();
            user.id = payload.id;
            user.name = payload.name;
            user.username = payload.username;

            return this.nextOnInit(user).asObservable();
        }

        return this.nextOnInit(null).asObservable();
    }

    private nextOnInit(user: User | null): BehaviorSubject<User | null> {
        if (!this.authenticatedUser) {
            this.authenticatedUser = new BehaviorSubject<User | null>(user);
        } else {
            this.authenticatedUser.next(user);
        }

        return this.authenticatedUser;
    }

    public authenticate(credential: Credential): Observable<void> {
        const subject = new Subject<void>();

        this.http.post<any>(
            `${this.apiURL}login`,
            credential,
          {observe: 'response'}
        ).subscribe((resp) => {
            this.setAuthenticated(resp.headers.get('Authorization'));
            subject.next();
            subject.complete();
        }, (error: HttpErrorResponse) => {
            this.logout();
            if (error.status === 401) {
                subject.error('Usuário ou senha inválido.');
            } else if (error.status === 400) {
                subject.error('É necessário um usuário e senha para entrar no sistema.');
            } else {
                subject.error('Aconteceu um erro interno. Entre em contato com o administrador do sistema.');
            }

            subject.complete();
        });

        return subject.asObservable();
    }

}
