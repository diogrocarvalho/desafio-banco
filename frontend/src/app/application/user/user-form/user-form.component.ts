import { User } from '../shared/user.model';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ErrorStateMatcher } from '@angular/material/core';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { AuthService } from '../../../auth/auth.service';
import { Group } from '../../group/shared/group.model';
import { Authority } from '../../authority/shared/authority.model';


@Component({
    selector: 'app-user-form',
    templateUrl: './user-form.component.html',
    styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {

    @Input()
    user!: User;

    @Input()
    includePassword = true;

    @Input()
    dialog = false;

    @Output()
    save: EventEmitter<User> = new EventEmitter<User>();

    @Output()
    changePassword: EventEmitter<User> = new EventEmitter<User>();

    password!: string;
    confirmPassword!: string;
    authenticatedUser!: User | null;

    nameFormControl = new FormControl('', [
        Validators.required,
        Validators.pattern(/[^\s]+/)
    ]);

    usernameFormControl!: FormControl;

    matcher = new UserErrorStateMatcher();

    constructor(private authService: AuthService) {}

    ngOnInit(): void {
        this.usernameFormControl = new FormControl({value: '', disabled: !this.includePassword}, [
          Validators.required,
          Validators.email,
        ]);
        this.getAuthenticatedUser();
    }

    onSave(): void {
        if (this.validateForm()) {
          const group = new Group();
          const authority = new Authority();
          authority.name = 'Admin';
          authority.id = 1;
          group.name = 'Admin';
          group.id = 1;
          group.authorities = [authority];
          this.user.groups = [group];

          if (this.includePassword) {
              this.user.password = this.password;
          }

          this.save.emit(this.user);
        }
    }

    correctPassword(): boolean {
        if (this.password) {
            const password = this.password.trim();
            return password.length > 0 && password === this.confirmPassword;
        }

        return false;
    }

    validateForm(): boolean {
        let isValid = true;

        isValid = isValid && (this.includePassword && this.correctPassword() || !this.includePassword);
        isValid = isValid && this.nameFormControl.valid;
        isValid = isValid && (this.usernameFormControl.valid || !this.includePassword);

        return isValid;
    }

    onChangePassword(): void {
        this.changePassword.emit();
    }

    getAuthenticatedUser(): void {
        this.authService.getAuthenticatedUser().subscribe((user: User | null) => {
            this.authenticatedUser = user;
            this.avoidInvalidSession();
        });
    }

    avoidInvalidSession(): void {
        if (!this.authenticatedUser || this.user.id && this.user.id === this.authenticatedUser.id) {
            this.usernameFormControl.disable();
        }
    }

}

export class UserErrorStateMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
        const isSubmitted = form && form.submitted;

        return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
    }
}
