import { Component, OnInit } from '@angular/core';
import { UserService } from '../shared/user.service';
import { ActivatedRoute, Data, Router } from '@angular/router';
import { User } from '../shared/user.model';

import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { SnackService } from '../../../shared/snack/snack-service';


@Component({
    selector: 'app-user-chane-passoword',
    templateUrl: './user-change-password.component.html',
    styleUrls: ['./user-change-password.component.scss']
})
export class UserChangePasswordComponent implements OnInit {

    user!: User;
    password!: string;
    confirmPassword!: string;

    constructor(private userService: UserService,
                private snackService: SnackService,
                private route: ActivatedRoute,
                private router: Router) { }

    ngOnInit(): void {
        this.getUser();
    }

    getUser(): void {
        this.route.data.subscribe((data: Data) => { this.user = data.user});
    }

    changePassword(): void {
        if (this.correctPassword()) {
            this.userService.changePassword(this.user.id, this.password).subscribe((response: HttpResponse<void>) => {
                this.router.navigate([`/users/edit/${this.user.id}`]).then(() => {
                    this.snackService.openSnack('Senha redefinida com sucesso.');
                });
            }, (error: HttpErrorResponse) => {
                this.snackService.showError(error);
            });
        }
    }

    correctPassword(): boolean {
        if (this.password) {
            const password = this.password.trim();
            return password.length > 0 && password === this.confirmPassword;
        }

        return false;
    }

}
