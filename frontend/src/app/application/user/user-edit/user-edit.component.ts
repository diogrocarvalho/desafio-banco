import { Component, OnInit } from '@angular/core';
import { UserService } from '../shared/user.service';
import { ActivatedRoute, Data, Router } from '@angular/router';
import { User } from '../shared/user.model';
import { HttpErrorResponse } from '@angular/common/http';
import { SnackService } from '../../../shared/snack/snack-service';



@Component({
    selector: 'app-user-edit',
    templateUrl: './user-edit.component.html',
    styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit {

    user!: User;

    constructor(private userService: UserService,
                private snackService: SnackService,
                private route: ActivatedRoute,
                private router: Router) { }

    ngOnInit(): void {
        this.getUser();
    }

    getUser(): void {
        this.route.data.subscribe((data: Data) => this.user = data.user);
    }

    update(user: User): void {
        this.userService.update(user).subscribe((u: User) => {
            this.user = u;
            this.router.navigate(['/users']).then(() => {});
        }, (error: HttpErrorResponse) => {
            this.snackService.showError(error);
        });
    }

}
