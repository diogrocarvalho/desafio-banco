import {UserService} from '../shared/user.service';
import {User} from '../shared/user.model';
import {Component} from '@angular/core';
import { Router } from '@angular/router';
import { SnackService } from '../../../shared/snack/snack-service';



@Component({
    selector: 'app-create-user',
    templateUrl: './user-create.component.html',
    styleUrls: ['./user-create.component.scss']
})
export class UserCreateComponent {

    user: User = new User();

    constructor(private userService: UserService,
                private router: Router,
                private snackService: SnackService) {}

    save(user: User): void {
        this.userService.save(user).subscribe((u: User) => {
            this.router.navigate(['/users']).then(() => {
                this.snackService.openSnack(`Usuário ${ u.username } criado com sucesso.`);
            });
        }, error => {
            this.snackService.showError(error);
        });
    }


}
