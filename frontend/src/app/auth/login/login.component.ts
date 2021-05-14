import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { Credential} from '../credential.model';


@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    credential: Credential  = new Credential();
    error!: string;

    @ViewChild('usernameField', { static: true })
    usernameField!: ElementRef;

    constructor(private authService: AuthService, private router: Router) { }

    ngOnInit(): void {
        this.usernameField.nativeElement.focus();
        this.goIfAuthenticated();
    }

    authenticate(): void {
        this.authService.authenticate(this.credential).subscribe(() => {
            this.goIfAuthenticated();
        }, (error: string) => {
            this.error = error;
        });
    }

    goIfAuthenticated(): void {
        if (this.authService.isAuthenticated()) {
            this.router.navigate(['/']).then();
        }
    }

}
