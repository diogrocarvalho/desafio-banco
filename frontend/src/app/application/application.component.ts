import { Component, OnInit } from '@angular/core';
import { MenuItem } from '../shared/menu/menu.component';
import { User } from './user/shared/user.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackService } from '../shared/snack/snack-service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.scss']
})
export class ApplicationComponent implements OnInit {
  MENU: { [key: string]: MenuItem } = MENU;
  authenticatedUser!: User | null;

  constructor(private matSnackBar: MatSnackBar,
              private snackService: SnackService,
              private router: Router,
              private route: ActivatedRoute,
              private authService: AuthService)  {}

  ngOnInit(): void {
    this.getAuthenticatedUser();
  }

  getAuthenticatedUser(): void {
    this.authService.getAuthenticatedUser().subscribe((user: User | null) => {
      this.authenticatedUser = user;
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['login']).then();
  }

}

const MENU: { [key: string]: MenuItem } = {
  FINANCE: new MenuItem(
    'Contas Bancárias',
    'account_balance',
    [''],
  )
};
