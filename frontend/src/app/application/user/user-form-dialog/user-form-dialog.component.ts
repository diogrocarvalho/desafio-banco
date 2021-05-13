import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { User } from '../shared/user.model';
import { UserService } from '../shared/user.service';
import { Router } from '@angular/router';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { SnackService } from '../../../shared/snack/snack-service';


@Component({
    selector: 'app-user-form-dialog',
    templateUrl: './user-form-dialog.component.html',
    styleUrls: ['./user-form-dialog.component.scss']
})
export class UserFormDialogComponent {
    user: User;
    editMode: boolean;
    changePasswordMode = false;
    password!: string;
    confirmPassword!: string;

    private done$: Subject<void> = new Subject();
    public done = this.done$.asObservable();

    constructor(private dialogRef: MatDialogRef<UserFormDialogComponent>,
                private userService: UserService,
                private router: Router,
                @Inject(MAT_DIALOG_DATA) data: {user: User, edit: false},
                private snackService: SnackService) {
            this.user = {...data.user};
            this.editMode = data.edit;
    }

    save(user: User): void {
        if (this.editMode) {
            this.edit(user);
        } else {
            this.create(user);
        }

    }

    create(user: User): void {
        this.userService.save(user).subscribe((u: User) => {
            this.done$.next();
            this.done$.complete();
            this.dialogRef.close();
            this.showSnack(u);
        }, error => {
            this.snackService.showError(error);
        });
    }

    edit(user: User): void {
        this.userService.update(user).subscribe((u: User) => {
            this.done$.next();
            this.done$.complete();
            this.dialogRef.close();
            this.showSnack(u);
        }, error => {
            this.snackService.showError(error);
        });
    }

    showSnack(user: User): void {
        if (this.editMode) {
            this.snackService.openSnack(`Usuário ${ user.username } editado com sucesso.`);
        } else {
            this.snackService.openSnack(`Usuário ${ user.username } criado com sucesso.`);
        }
    }

    changePassword(): void {
        this.changePasswordMode = !this.changePasswordMode;
    }

    savePassword(): void {
        if (this.correctPassword()) {
            this.userService.changePassword(this.user.id, this.password).subscribe((response: HttpResponse<void>) => {
                this.snackService.openSnack('Senha redefinida com sucesso.');
                this.dialogRef.close();
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
